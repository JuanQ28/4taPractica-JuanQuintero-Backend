import { Router } from "express";
import { cartsManager } from "../dao/manager-mongo/CartsManager.mongo.js";

const router = Router()

router.get("/", async (request, response) => {
    try {
        const carts = await cartsManager.getCarts()
        response.status(200).json({message: "Carts", carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.get("/:cid", async (request, response) => {
    const {cid} = request.params
    try {
        const products = await cartsManager.getCardById(cid)
        response.status(200).json({message: "Cart Found", products})
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


router.post("/:cid/products/:pid", async (request, response) => {
    const {cid, pid} = request.params
    try {
        const product = await cartsManager.addCartProduct(cid, pid)
        response.status(200).json({message: `Product added with id:${cid}`, product})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.delete("/:cid", async (request, response) => {
    const {cid} = request.params
    try {
        const carts = await cartsManager.deleteCartProducts(cid)
        response.status(200).json({message: `Products deleted in cart with id:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.delete("/:cid/products/:pid", async (request, response) => {
    const {cid, pid} = request.params
    try {
        const carts = await cartsManager.deleteCartProduct(cid, pid)
        response.status(200).json({message: `Product:${pid}, removed in cart:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.put("/:cid", async (request, response) => {
    const {cid} = request.params
    try {
        const carts = await cartsManager.updateCart(cid, request.body)
        response.status(200).json({message: `Cart modified with id:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.put("/:cid/products/:pid", async (request, response) => {
    const {cid, pid} = request.params
    try {
        const carts = await cartsManager.updateCartProduct(cid, pid, request.body.quantity)
        response.status(200).json({message: `Product:${pid}, in cart:${cid}, his new quantity is:${request.body.quantity}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

export default router