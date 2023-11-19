import { Router } from "express";
import { usersManager } from "../dao/manager-mongo/UsersManager.mongo.js";
import { hashData } from "../utils.js";
import passport from "passport";

const router = Router()

router.post("/signup", passport.authenticate("signup", {
    successRedirect:"/login",
    failureRedirect: "/signup"
}))

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.get("/auth/github", passport.authenticate('github', 
    { scope: [ 'user:email' ] })
)

router.get("/callback", passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login"
}))

router.post("/restore", async (request, response) => {
    const {email, password} = request.body
    try {
        const user = await usersManager.findByEmail(email)
        if(!user){
            return response.redirect("/login")
        }
        const passwordHashed = await hashData(password)
        user.password = passwordHashed
        await user.save()
        response.redirect("/login")
    } catch (error) {
        response.status(500).json({error})
    }
})

router.get("/signout", async (request, response) => {
    try {
        request.session.destroy(() => {
            response.redirect("/login")
        })
    } catch (error) {
        response.status(500).json({error})
    }
})


export default router