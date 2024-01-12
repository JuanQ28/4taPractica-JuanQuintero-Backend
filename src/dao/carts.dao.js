import { cartsModel } from "../models/carts.model.js";

class CartsManager {
    async getCarts(){
        const result = await cartsModel.find()
        return result
    }
    async addCart(newCart){
        const result = await cartsModel.create(newCart)
        return result
    }
    async getCardById(id){
        const result = await cartsModel.findById(id).populate("products.product").lean()
        return result 
    }
    async getCardByIdModify(id){
        const result = await cartsModel.findById(id)
        return result 
    }
    async deleteCartProducts(idCart){
        const cart = await cartsModel.findById(idCart)
        cart.products=[]
        return cart.save()
    }
    async updateCart(idCart, body){
        const cart = await cartsModel.findById(idCart)
        cart.products = body
        return cart.save()
    }
}

export const cartsManager = new CartsManager()