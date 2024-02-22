import { Router } from "express";
import passport from "passport";
import * as usersController from "../controllers/users.controller.js";
import { userServices } from "../services/users.services.js";
import { compareData, hashData } from "../tools.js";
import { logger } from "../utils/logger.js";

const router = Router()

router.post("/signup", passport.authenticate("signup", {
    successRedirect:"/login",
    failureRedirect: "/signup",
}))
router.post("/login", usersController.login)
router.post("/restore", usersController.restore)
router.post("/restore/:id", async (request, response) => {
    const {id} = request.params
    const {password1, password2} = request.body
    try {
        const user = await userServices.findById(id)
        const isPasswordValid1 = await compareData(password1, user.password)
        const isPasswordValid2 = await compareData(password2, user.password)
        if(!user){
            return response.render("/login")
        }
        if(isPasswordValid1 || isPasswordValid2){
            return response.status(401).json({message: "Cambia tu contraseña, coíncide con la anterior"})
        }
        if(password1 !== password2){
            return response.status(401).json({message: "No coinciden las contraseñas"})
        }
        const hashPassword = await hashData(password1)
        user.password = hashPassword
        await user.save()
        logger.info("An user change password correctly")
        return response.clearCookie("responseAuth").render("login")
    } catch (error) {
        response.status(500).json({error})
    }
})
router.get("/signout", usersController.signout)
router.post("/changeRole/:id", async (request, response) => {
    const {id} = request.params
    try {
        const user = await userServices.findById(id)
        let token = request.cookies.token
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        if(!user){
            return response.render("/login")
        }
        if(user.role === "CLIENT"){
            user.role = "PREMIUM"
            await user.save()
        }else if(user.role === "PREMIUM"){
            user.role = "CLIENT"
            await user.save()
        }
        const {email} = token
        const result = await userServices.getUsers()
        const resultNotAdmin = result.filter((user) => user.role !== "ADMIN")
        response.render("adminUsers", {resultNotAdmin, user: {email}})
        logger.info(`Role changed at the user: ${user.firstName} ${user.lastName}`)
        logger.http("Admin users view charged")
        return response.redirect("http://localhost:8080/admin/usersRoles")
        //return response.render("adminUsers", {resultNotAdmin, user: {email}})
    } catch (error) {
        response.status(500).json({error})
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

//Obtención del usuario actual a través de JWT
/* router.get("/current", async (request, response) => {
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
}) */

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
        const currentUser = jwt.verify(request.cookies.token, config.key_jwt)
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