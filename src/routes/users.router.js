import { Router } from "express";
import passport from "passport";
import * as usersController from "../controllers/users.controller.js";

const router = Router()

router.post("/signup", passport.authenticate("signup", {
    successRedirect:"/login",
    failureRedirect: "/signup",
}))
router.post("/login", usersController.login)
router.post("/restore", usersController.restore)
router.get("/signout", usersController.signout)

//Obtención del usuario actual a través de JWT
router.get("/current", async (request, response) => {
    try {
        const currentUser = await request.user
        console.log("current:" ,currentUser)
        if(!request.session.passport){
            return response.status(404).json({message: "Current user not available"})
        }else{
            return response.status(200).json({message: "Current user available", user: currentUser.name})
        }
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})
//Github Strategy
router.get("/auth/github", passport.authenticate('github', 
{ scope: [ 'user:email' ] })
)

router.get("/github/callback", passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login"
}))
//
//Google Strategy
router.get("/auth/google", passport.authenticate('google', 
{ scope: [ 'profile', 'email' ] })
)

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login"
}))
//

export default router


/* router.post("/login", passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect: "/login",
})) */
/* router.get("/signout", async (request, response) => {
    try {
        response.clearCookie("token").redirect("/login")
    } catch (error) {
        response.status(500).json({error})
    }
}) */
//Obtención de token a través de cookies
/* router.get("/cookies", passport.authenticate("jwt", {session: false}), async (request, response) => {
    try {
        const currentUser = jwt.verify(request.cookies.token, "Proyecto47315")
        console.log(currentUser)
        if(currentUser){
            return response.status(200).json({message: "Current user available", user: currentUser})
        }else{
            return response.status(404).json({message: "Current user not available"})
        }
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}) */
/* router.post("/login", async (request, response) => {
    const {email: emailUser, password} = request.body
    try {
        const user = await usersManager.findByEmail(emailUser)
        if(!user){
            return response.redirect("/login")
        }
        const isPasswordValid = compareData(password, user.password)
        if(!isPasswordValid){
            return response.status(401).json({message:"Contraseña incorrecta"})
        }
        const {name, lastName, email, role} = user
        const token = generateToken({name, lastName, email, role})
        response.cookie("token", token, {httpOnly: true}).redirect("/")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}) */