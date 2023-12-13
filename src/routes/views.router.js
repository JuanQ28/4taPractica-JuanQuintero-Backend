import { Router } from "express";
import * as viewsController from "../controllers/views.controller.js";
//import jwt from "jsonwebtoken";

const router = Router()

router.get("/", viewsController.getProductsHome)
router.get("/current", viewsController.current)
router.get("/products/realtimeproducts", viewsController.getProductsRealTime)
router.get("/cart/:cid", viewsController.getCardById)
router.get("/chat", viewsController.chat)
router.get("/login", viewsController.login)
router.get("/signup", viewsController.signup)
router.get("/restore", viewsController.restore)

export default router

/* router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    console.log("token" ,request.cookies.token)
    if(!request.cookies.token){
        return response.redirect("/login")
    }
    const userToken = jwt.verify(request.cookies.token, "Proyecto47315")
    console.log("UserToken", userToken)
    const {name, email} = userToken
    response.render("home", {result, user: {name, email}})
}) */
//Mala práctica: sessions y jwt en paralelo
/* router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    console.log("token" , request.cookies.token)
    console.log("session", request.session.passport)
    if(!request.cookies.token && !request.session.passport){
        return response.redirect("/login")
    }else if(request.cookies.token){
        const userToken = jwt.verify(request.cookies.token, "Proyecto47315")
        const {name, email} = userToken
        return response.render("home", {result, user: {name, email}})
    }else if(request.session.passport){
        const {name, email} = await request.user
        return response.render("home", {result, user: {name, email}})
    }
}) */