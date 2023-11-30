import passport from "passport";
import { usersManager } from "./dao/manager-mongo/UsersManager.mongo.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import { ExtractJwt, Strategy as JWTStrategy} from "passport-jwt";
import { compareData, hashData } from "./utils.js";

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = usersManager.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})

passport.use(
    "signup",
    new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (request, email, password, done) => {
            try {
                const passwordHashed = await hashData(password)
                const newUser = await usersManager.createUser({
                    ...request.body,
                    password: passwordHashed
                })
                done(null, newUser)
            } catch (error) {
                done(error)
            }
        }
    )
)

//Login por medio de sessiones
/* passport.use(
    "login",
    new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (request, email, password, done) => {
            try {
                const user = await usersManager.findByEmail(email)
                if(!user){
                    return done(null, false)
                }
                const isPasswordValid = compareData(password, user.password)
                if(!isPasswordValid){
                    return done(null, false)
                }
                const userInfo = email === "adminCoder@coder.com" && password === "adminCod3r123" 
                    ? {email: email, name: user.name, isAdmin: true}
                    : {email: email, name: user.name, isAdmin: false}
                request.session.user = userInfo
                done(null, user)
            } catch (error) {
                done(error)
            }
        }
    )
) */

//Validaciones próximas con JWT
const fromCookies = (request) => {
    return request.cookies.token
}
passport.use("jwt", new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        secretOrKey: "Proyecto47315",
        //passReqToCallback: true
    },
    async (jwt_payload, done) => {
        /* try {
            if(jwt_payload){
                request.currentUser = jwt_payload
            }
            console.log(jwt_payload)
            done(null, jwt_payload)
        } catch (error) {
            done(error)
        } */
        done(null, jwt_payload)
    }
))

passport.use("github", new GithubStrategy(
    {
        clientID: "Iv1.1884fc5f29e407c5",
        clientSecret: "98f2d7a65af9a997b42cb06332ff57bf7670faac",
        callbackURL: "http://localhost:8080/api/mongo/users/github/callback",
        scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await usersManager.findByEmail(profile._json.email)
            if(user){
                if(user.auth === "GITHUB"){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            }
            const infoUser = {
                name: profile._json.name.split(" ")[0] || profile.displayname || profile.username,
                lastName: profile._json.name.split(" ")[1] || profile.displayname || profile.username,
                email: profile._json.email || profile.emails[0].value || profile.email[0].value || `${profile.username}.null@gmail.com`,
                password: " ",
                auth: "GITHUB"
            }
            const userCreated = await usersManager.createUser(infoUser)
            done(null, userCreated)
        } catch (error) {
            done(error)
        }
    }
))

passport.use(new GoogleStrategy(
    {
        clientID: "242615235089-0qhu42ncffjr1h3o3jigl3bkodvv6rec.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/api/mongo/users/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await usersManager.findByEmail(profile._json.email)
            if(user){
                if(user.auth === "GOOGLE"){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            }
            const infoUser = {
                name: profile._json.given_name,
                lastName: profile._json.family_name,
                email: profile._json.email,
                password: " ",
                auth: "GOOGLE"
            }
            const userCreated = await usersManager.createUser(infoUser)
            done(null, userCreated)
        } catch (error) {
            done(error)
        }
    }
));