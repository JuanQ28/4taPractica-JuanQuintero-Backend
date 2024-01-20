import { productsServices } from "../services/products.services.js"
import { v4 as uuidv4 } from 'uuid'
import { removeEmpty } from "../tools.js"
import { logger } from "../utils/logger.js"

const getProducts = async (request, response) => {
    try {
        logger.info("Products received by route")
        const result = await productsServices.getProducts(request.query)
        response.status(200).json({message: "Products", result})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const addProducts = async (request, response) => {
    try {
        logger.info("Product added by route")
        const product = await productsServices.addProducts({code: uuidv4(), ...request.body})
        response.redirect("/admin/products")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const getProductById = async (request, response) => {
    const {pid} = request.params
    try {
        logger.info("Product received for id by route")
        const products = await productsServices.getProductById(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateProduct = async (request, response) => {
    const {pid} = request.params
    try {
        logger.info("Product updated by route")
        const productUpdates = removeEmpty(request.body)
        await productsServices.updateProduct(pid, productUpdates)
        response.redirect(`http://localhost:8080/admin/products/${pid}`)
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteProduct = async (request, response) => {
    const {pid} = request.params
    try {
        logger.info("Product deleted by route")
        await productsServices.deleteProduct(pid)
        response.redirect("/admin/products")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

export {
    getProducts,
    addProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
