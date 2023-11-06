import { cartsModel } from "../models/carts.model.js";

class CartsManager {
    async getCarts(){
        const result = await cartsModel.find()
        return result
    }
    async addCart(){
        const newCart = {products : []}
        const result = await cartsModel.create(newCart)
        return result
    }
    async addCartProduct(idCart, idProduct){
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
    async getCardById(id){
        const result = await cartsModel.findById(id).populate("products.product").lean()
        return result 
    }
    async deleteCartProducts(idCart){
        const cart = await cartsModel.findById(idCart)
        cart.products=[]
        return cart.save()
    }
    async deleteCartProduct(idCart, idProduct){
        const cart = await cartsModel.findById(idCart)
        const indexCart = cart.products.findIndex((prdt)=> prdt.product.equals(idProduct))
        if (indexCart !== -1) {
            cart.products.splice(indexCart, 1)
        }
        return cart.save()
    }
    async updateCart(idCart, body){
        const cart = await cartsModel.findById(idCart)
        cart.products = body
        return cart.save()
    }
    async updateCartProduct(idCart, idProduct, quantity){
        const cart = await cartsModel.findById(idCart)
        const indexCart = cart.products.findIndex((prdt)=> prdt.product.equals(idProduct))
        if (indexCart !== -1) {
            cart.products[indexCart].quantity = quantity
        }
        return cart.save()
    }
}

export const cartsManager = new CartsManager()