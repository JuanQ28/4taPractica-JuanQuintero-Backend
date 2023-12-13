import * as productsServices from "../services/products.services.js"

const getProducts = async (request, response) => {
    try {
        const result = await productsServices.getProducts(request.query)
        response.status(200).json({message: "Products", result})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const addProducts = async (request, response) => {
    try {
        const product = await productsServices.addProducts(request.body)
        response.status(200).json({message: "Product created", product})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const getProductById = async (request, response) => {
    const {pid} = request.params
    try {
        const products = await productsServices.getProductById(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateProduct = async (request, response) => {
    const {pid} = request.params
    try {
        const products = await productsServices.updateProduct(pid, request.body)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteProduct = async (request, response) => {
    const {pid} = request.params
    try {
        const products = await productsServices.deleteProduct(pid)
        response.status(200).json({message: "Products", products})
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
