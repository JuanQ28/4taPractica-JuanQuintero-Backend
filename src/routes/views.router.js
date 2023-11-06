import { Router } from "express";
import { productsManager } from "../dao/manager-mongo/ProductManager.mongo.js";
import { cartsManager } from "../dao/manager-mongo/CartsManager.mongo.js";

const router = Router()

router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    response.render("home", {result})
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

export default router