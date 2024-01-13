import { Router } from "express";
import * as viewsController from "../controllers/views.controller.js";
import { JWTIsExpired } from "../middlewares/JWTExpired.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router()
router.get("/", JWTIsExpired, authMiddleware(["CLIENT"]), viewsController.getProductsHome)
router.get("/cart/:cid", JWTIsExpired, authMiddleware(["CLIENT"]), viewsController.getCardById)
router.get("/chat", JWTIsExpired, authMiddleware(["CLIENT"]), viewsController.chat)
router.get("/productDetail/:id", JWTIsExpired, viewsController.productDetail)
router.get("/login", viewsController.login)
router.get("/signup", viewsController.signup)
router.get("/restore", viewsController.restore)
router.get("/current", viewsController.current)
router.get("/products/realtimeproducts", viewsController.getProductsRealTime)

//Vistas de admin//

router.get("/admin", JWTIsExpired, authMiddleware(["ADMIN"]), viewsController.adminHome)
router.get("/admin/products", JWTIsExpired, authMiddleware(["ADMIN"]), viewsController.adminProducts)
router.get("/admin/products/:pid", JWTIsExpired, authMiddleware(["ADMIN"]), viewsController.adminProductUpdate)

///////////////////

router.get("/mockingproducts", viewsController.mockingProducts)

export default router

/* router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    console.log("token" ,request.cookies.token)
    if(!request.cookies.token){
        return response.redirect("/login")
    }
    const userToken = jwt.verify(request.cookies.token, config.key_jwt)
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
        const userToken = jwt.verify(request.cookies.token, config.key_jwt)
        const {name, email} = userToken
        return response.render("home", {result, user: {name, email}})
    }else if(request.session.passport){
        const {name, email} = await request.user
        return response.render("home", {result, user: {name, email}})
    }
}) */