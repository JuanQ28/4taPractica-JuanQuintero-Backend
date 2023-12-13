import { Router } from "express";
import * as producstController from "../controllers/products.controller.js"

const router = Router()

router.get("/", async (request, response) => {
    try {
        const result = await producstController.getProducts(request.query)
        response.status(200).json({message: "Products", result})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.post("/", async (request, response) => {
    try {
        const product = await producstController.addProducts(request.body)
        response.status(200).json({message: "Product created", product})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.get("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await producstController.getProductById(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.put("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await producstController.updateProduct(pid, request.body)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

router.delete("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await producstController.deleteProduct(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

export default router