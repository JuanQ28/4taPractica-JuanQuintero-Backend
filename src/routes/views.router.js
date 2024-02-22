import { Router } from "express";
import * as viewsController from "../controllers/views.controller.js";
import { JWTIsExpired } from "../middlewares/JWTExpired.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userServices } from "../services/users.services.js";
import { productsServices } from "../services/products.services.js";
import { logger } from "../utils/logger.js";

const router = Router()
router.get("/", JWTIsExpired, authMiddleware(["CLIENT", "PREMIUM"]), viewsController.getProductsHome)
router.get("/cart/:cid", JWTIsExpired, authMiddleware(["CLIENT", "PREMIUM"]), viewsController.getCardById)
router.get("/chat", JWTIsExpired, authMiddleware(["CLIENT", "PREMIUM"]), viewsController.chat)
router.get("/productDetail/:id", JWTIsExpired, viewsController.productDetail)
router.get("/login", viewsController.login)
router.get("/signup", viewsController.signup)
router.get("/restore", viewsController.restore)
router.get("/restore/:id", async (request, response) => {
    const {id} = request.params
    const responseAuth = request.cookies.restoreCookie
    try {
        const user = await userServices.findById(id)
        if(!responseAuth){
            return response.render("restorePasswordBad")
        }
        if(!user){
            return response.render("login")
        }
        const userResult = await userServices.findById(id)
        const {_id, firstName, lastName} = userResult
        response.render("restorePasswordGood", {user: {_id, firstName, lastName}})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})
router.get("/current", viewsController.current)
router.get("/products/realtimeproducts", viewsController.getProductsRealTime)

//Vistas de admin//

router.get("/admin", JWTIsExpired, authMiddleware(["ADMIN"]), viewsController.adminHome)
router.get("/admin/products", JWTIsExpired, authMiddleware(["ADMIN", "PREMIUM"]), viewsController.adminProducts)
router.get("/admin/products/:pid", JWTIsExpired, authMiddleware(["ADMIN"]), viewsController.adminProductUpdate)
router.get("/admin/usersRoles", JWTIsExpired, authMiddleware(["ADMIN"]), async (request, response) => {
    try {
        let token = request.cookies.token
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        const {email} = token
        const result = await userServices.getUsers()
        const resultNotAdmin = result.filter((user) => user.role !== "ADMIN")
        logger.http("Admin users view charged")
        response.render("adminUsers", {resultNotAdmin, user: {email}})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

///////////////////

router.get("/mockingproducts", viewsController.mockingProducts)
router.get("/loggertest", viewsController.loggerTest)

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