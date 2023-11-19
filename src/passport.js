import passport from "passport";
import { usersManager } from "./dao/manager-mongo/UsersManager.mongo.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
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

passport.use(
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
)

passport.use("github", new GithubStrategy(
    {
        clientID: "Iv1.1884fc5f29e407c5",
        clientSecret: "98f2d7a65af9a997b42cb06332ff57bf7670faac",
        callbackURL: "http://localhost:8080/api/mongo/users/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await usersManager.findByEmail(profile._json.email)
            if(user){
                if(user.isGithub){
                    return done(null, user)
                }else{
                    return done(null, false)
                }
            }
            console.log(profile)
            const infoUser = {
                name: profile._json.name.split(" ")[0],
                lastName: profile._json.name.split(" ")[1],
                email: profile._json.email,
                password: " ",
                isGithub: true
            }
            const userCreated = await usersManager.createUser(infoUser)
            done(null, userCreated)
        } catch (error) {
            done(error)
        }
    }
))