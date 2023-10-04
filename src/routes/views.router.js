import { Router } from "express";
import {productManager} from "../manager/ProductManager.js";

const router = Router()

router.get("/", async (request, response) => {
    const products = await productManager.getProducts()
    response.render("home", {products})
})

router.get("/realtimeproducts", async (request, response) => {
    const products = await productManager.getProducts()
    response.render("realTimeProducts", {products})
})

export default router