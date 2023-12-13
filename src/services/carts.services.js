import { cartsManager } from "../dao/carts.dao.js";

const getCarts = async () => {
    const result = await cartsManager.getCarts()
    return result
}
const addCart = async () => {
    const newCart = {products : []}
    const result = await cartsManager.addCart(newCart)
    return result
}
//
const addCartProduct = async (idCart, idProduct) => {
    const cart = await cartsModel.findById(idCart)
    const indexCart = cart.products.findIndex((prdt)=> prdt.product.equals(idProduct))
    if (indexCart === -1) {
        cart.products.push({
            product: idProduct,
            quantity: 1
        })
    } else {
        cart.products[indexCart].quantity++
    }
    return cart.save()
}
//
const getCardById = async (id) => {
    const result = await cartsManager.getCardById(id)
    return result 
}
const deleteCartProducts = async (idCart) => { 
    const result = await cartsManager.deleteCartProducts(idCart)
    return result
}
const deleteCartProduct = async (idCart, idProduct) => {
    const result = await cartsManager.deleteCartProduct(idCart, idProduct)
    return result
}
const updateCart = async (idCart, body) => {
    const result = await cartsManager.updateCart(idCart, body)
    return result
}
const updateCartProduct = async (idCart, idProduct, quantity) => {
    const result = await cartsManager.updateCartProduct(idCart, idProduct, quantity)
    return result
}

export {
    getCarts,
    addCart,
    addCartProduct,
    getCardById,
    deleteCartProducts,
    deleteCartProduct,
    updateCart,
    updateCartProduct
}