import { Router } from "express";
import { productsManager } from "../dao/manager-mongo/ProductManager.mongo.js";

const router = Router()

router.get("/", async (request, response) => {
    try {
        const products = await productsManager.getProducts()
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.post("/", async (request, response) => {
    try {
        const product = await productsManager.addProducts(request.body)
        response.status(200).json({message: "Product created", product})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.get("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await productsManager.getProductById(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.put("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await productsManager.updateProduct(pid, request.body)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.delete("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await productsManager.deleteProduct(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

export default router