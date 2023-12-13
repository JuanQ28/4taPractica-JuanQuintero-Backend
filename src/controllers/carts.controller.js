import * as cartsServices from "../services/carts.services.js"

const getCarts = async (request, response) => {
    try {
        const carts = await cartsServices.getCarts()
        response.status(200).json({message: "Carts", carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}
const getCardById = async (request, response) => {
    const {cid} = request.params
    try {
        const products = await cartsServices.getCardById(cid)
        response.status(200).json({message: "Cart Found", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}
const addCart = async (request, response) => {
    try {
        const cart = await cartsServices.addCart()
        response.status(200).json({message: "Cart created", cart})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}
const addCartProduct = async (request, response) => {
    const {cid, pid} = request.params
    try {
        const product = await cartsServices.addCartProduct(cid, pid)
        response.status(200).json({message: `Product added with id:${cid}`, product})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteCartProducts = async (request, response) => {
    const {cid} = request.params
    try {
        const carts = await cartsServices.deleteCartProducts(cid)
        response.status(200).json({message: `Products deleted in cart with id:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteCartProduct = async (request, response) => {
    const {cid, pid} = request.params
    try {
        const carts = await cartsServices.deleteCartProduct(cid, pid)
        response.status(200).json({message: `Product:${pid}, removed in cart:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateCart = async (request, response) => {
    const {cid} = request.params
    try {
        const carts = await cartsServices.updateCart(cid, request.body)
        response.status(200).json({message: `Cart modified with id:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateCartProduct = async (request, response) => {
    const {cid, pid} = request.params
    try {
        const carts = await cartsServices.updateCartProduct(cid, pid, request.body.quantity)
        response.status(200).json({message: `Product:${pid}, in cart:${cid}, his new quantity is:${request.body.quantity}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

export {
    getCarts,
    getCardById,
    addCart,
    addCartProduct,
    deleteCartProducts,
    deleteCartProduct,
    updateCart,
    updateCartProduct
}