import { productsManager } from "../dao/products.dao.js"

const getProducts = async (query) => {
    const result = productsManager.getProducts(query)
    return result
}
const addProducts = async (product) => { 
    const result = await productsManager.addProducts(product)
    return result
}
const getProductById = async (id) => {
    const result = await productsManager.getProductById(id)
    return result
}
const updateProduct = async (id, update) => {
    const result = await productsManager.updateProduct({_id: id}, update)
    return result
}
const deleteProduct = async(id) => {
    const result = await productsManager.deleteProduct({_id: id})
    return result
}

export {
    getProducts,
    addProducts,
    getProductById,
    updateProduct,
    deleteProduct
}