import { Router } from "express";
import {productManager} from "../dao/manager-fs/ProductManager.js";

const router = Router()

router.get("/products", async (request, response) => {
    const products = await productManager.getProducts()
    response.render("home", {products})
})

router.get("/products/realtimeproducts", async (request, response) => {
    const products = await productManager.getProducts()
    response.render("realTimeProducts", {products})
})

router.get("/chat", async (request, response) => {
    response.render("chat")
})

export default router