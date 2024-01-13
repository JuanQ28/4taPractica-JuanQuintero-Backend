import passport from "passport";
import { usersManager } from "./dao/users.dao.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import { ExtractJwt, Strategy as JWTStrategy} from "passport-jwt";
import { compareData } from "./utils.js";
import { cartsManager } from "./dao/carts.dao.js";
import {userServices} from "./services/users.services.js";
import config from "./config/config.js";

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
                let role = "CLIENT"
                if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
                    role = "ADMIN"
                }
                const newUser = await userServices.createUser({...request.body, role})
                done(null, newUser)
            } catch (error) {
                done(error)
            }
        }
    )
)

//Login por medio de sessiones
passport.use(
    "login",
    new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"},
        async (request, email, password, done) => {
            try {
                const user = await userServices.findByEmail(email)
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
)

passport.use("github", new GithubStrategy(
    {
        clientID: "Iv1.1884fc5f29e407c5",
        clientSecret: "98f2d7a65af9a997b42cb06332ff57bf7670faac",
        callbackURL: "http://localhost:8080/api/users/github/callback",
        scope: [ 'user:email' ]
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findByEmail(profile._json.email)
            const userCart = await cartsManager.addCart()
            if(user){
                if(user.auth === "GITHUB"){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            }
            const infoUser = {
                firstName: profile._json.name.split(" ")[0] || profile.username,
                lastName: profile._json.name.split(" ")[1] || profile.username,
                email: profile.emails[0].value || profile._json.email || `${profile.username}.null@gmail.com`,
                password: " ",
                auth: "GITHUB",
                cart: userCart._id
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
        callbackURL: "http://localhost:8080/api/users/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findByEmail(profile._json.email)
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

//Validaciones próximas con JWT
const fromCookies = (request) => {
    return request.cookies.token
}
passport.use("jwt", new JWTStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        secretOrKey: config.key_jwt,
    },
    async (jwt_payload, done) => {
        try {
            console.log("payload" ,jwt_payload)
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
))