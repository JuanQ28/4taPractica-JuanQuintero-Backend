import { Router } from "express";
import { cartsManager } from "../dao/manager-mongo/CartsManager.mongo.js";

const router = Router()

router.get("/", async (request, response) => {
    try {
        const carts = await cartsManager.getCarts()
        response.status(200).json({message: "carts", carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.post("/", async (request, response) => {
    try {
        const cart = await cartsManager.addCart()
        response.status(200).json({message: "Cart created", cart})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.get("/:cid", async (request, response) => {
    const {cid} = request.params
    try {
        const products = await cartsManager.getCardById(cid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

export default router