import { Router } from "express";
import { productsManager } from "../dao/manager-mongo/ProductManager.mongo.js";
import { cartsManager } from "../dao/manager-mongo/CartsManager.mongo.js";

const router = Router()

router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    const user = request.session.user
    response.render("home", {result, user})
})

router.get("/products/realtimeproducts", async (request, response) => {
    const products = await productsManager.getProducts()
    response.render("realTimeProducts", {products})
})

router.get("/cart/:cid", async (request, response) => {
    const {cid} = request.params
    const cartProducts = await cartsManager.getCardById(cid)
    response.render("cart", {cartProducts})
})

router.get("/chat", async (request, response) => {
    response.render("chat")
})

router.get("/login", async (request, response) => {
    if(request.session.user){
        response.redirect("/")
    }
    response.render("login")
})

router.get("/signup", async (request, response) => {
    if(request.session.user){
        response.redirect("/")
    }
    response.render("signup")
})

export default router