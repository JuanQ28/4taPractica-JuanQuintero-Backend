import { Router } from "express";
import { usersManager } from "../dao/manager-mongo/UsersManager.mongo.js";

const router = Router()

router.post("/login", async (request, response) => {
    const {email, password} = request.body
    try {
        const user = await usersManager.findByEmail(email)
        console.log(user)
        if(!user){
            return response.redirect("/login")
        }
        const isPasswordValid = user.password === password
        if(!isPasswordValid){
            return response.status(401).json({message:"Contraseña incorrecta"})
        }
        const userInfo = email === "adminCoder@coder.com" && password === "adminCod3r123" 
            ? {email: email, name: user.name, isAdmin: true}
            : {email: email, name: user.name, isAdmin: false}
        request.session.user = userInfo
        response.redirect("/")
    } catch (error) {
        response.status(500).json({error})
    }
})

router.post("/signup", async (request, response) => {
    try {
        const newUser = await usersManager.createUser(request.body)
        /* Toastify({
            text: `Bienvenido ${newUser.name}`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "left",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast(); */
        console.log(newUser)
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