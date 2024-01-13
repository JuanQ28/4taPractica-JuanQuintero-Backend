import { cartsManager } from "../dao/carts.dao.js";
import CustomError from "../errors/error.generator.js";
import { errors } from "../errors/errors.enum.js";

class cartsRepository{
    constructor(dao){
        this.dao = dao
    }
    getCarts = async () => {
        const result = await cartsManager.getCarts()
        return result
    }
    addCart = async () => {
        const newCart = {products : []}
        const result = await cartsManager.addCart(newCart)
        return result
    }
    addCartProduct = async (idCart, idProduct) => {
        const cart = await cartsManager.getCardByIdModify(idCart)
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
    getCardById = async (id) => {
        const result = await cartsManager.getCardById(id)
        return result 
    }
    deleteCartProducts = async (idCart) => {
        const cart = await cartsServices.getCardById(idCart)
        cart.products=[]
        return cart.save()
    }
    deleteCartProduct = async (idCart, idProduct) => {
        const cart = await cartsManager.getCardByIdModify(idCart)
        const indexCart = cart.products.findIndex((prdt)=> prdt.product.equals(idProduct))
        if (indexCart !== -1) {
            cart.products.splice(indexCart, 1)
        }
        return cart.save()
    }
    updateCart = async (idCart, body) => {
        const result = await cartsManager.updateCart(idCart, body)
        return result
    }
    updateCartProduct = async (idCart, idProduct, quantity) => {
        const cart = await cartsManager.getCardByIdModify(idCart)
        const indexCart = cart.products.findIndex((prdt)=> prdt.product.equals(idProduct))
        if (indexCart !== -1) {
            cart.products[indexCart].quantity = quantity
        }
        return cart.save()
    }
}

export const cartsServices = new cartsRepository(cartsManager)