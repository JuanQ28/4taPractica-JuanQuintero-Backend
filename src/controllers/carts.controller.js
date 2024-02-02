import {cartsServices} from "../services/carts.services.js"
import CustomError from "../errors/error.generator.js";
import { errors } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";

const getCarts = async (request, response) => {
    try {
        logger.info("Carts received by route")
        const carts = await cartsServices.getCarts()
        response.status(200).json({message: "Carts", carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}
const getCardById = async (request, response) => {
    const {cid} = request.params
    try {
        logger.info("Cart by id received by route")
        const cart = await cartsServices.getCardById(cid)
        if(!cart){
            CustomError.generateError(errors.CART_NOT_FOUND.message, errors.CART_NOT_FOUND.code, errors.CART_NOT_FOUND.name)
        }
        response.status(200).json({message: "Cart Found", cart})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}
const addCart = async (request, response) => {
    try {
        logger.info("Card added by route")
        const cart = await cartsServices.addCart()
        response.status(200).json({message: "Cart created", cart})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}
const addCartProduct = async (request, response) => {
    const {cid, pid} = request.params
    try {
        logger.info("Product added in a card by route")
        //const product = await cartsServices.addCartProduct(cid, pid)
        await cartsServices.addCartProduct(cid, pid)
        //response.status(200).json({message: `Product added in id:${cid}`, product})
        response.redirect(`/productDetail/${pid}`)
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteCartProducts = async (request, response) => {
    const {cid} = request.params
    try {
        logger.info("Products delete in a cart by route")
        const carts = await cartsServices.deleteCartProducts(cid)
        response.status(200).json({message: `Products deleted in cart with id:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteCartProduct = async (request, response) => {
    const {cid, pid} = request.params
    try {
        logger.info("Product delete in a cart by route")
        //const carts = await cartsServices.deleteCartProduct(cid, pid)
        //response.status(200).json({message: `Product:${pid}, removed in cart:${cid}`, carts})
        await cartsServices.deleteCartProduct(cid, pid)
        response.redirect(`http://localhost:8080/cart/${cid}`)
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateCart = async (request, response) => {
    const {cid} = request.params
    try {
        logger.info("Cart updated by route")
        const carts = await cartsServices.updateCart(cid, request.body)
        response.status(200).json({message: `Cart modified with id:${cid}`, carts})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateCartProduct = async (request, response) => {
    const {cid, pid} = request.params
    try {
        logger.info("Product updated in cart by route")
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