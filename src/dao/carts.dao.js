import { cartsModel } from "../models/carts.model.js";
import { logger } from "../utils/logger.js";

class CartsManager {
    async getCarts(){
        const result = await cartsModel.find()
        logger.http("Carts received correctly")
        return result
    }
    async addCart(newCart){
        const result = await cartsModel.create(newCart)
        logger.http("Cart added correctly")
        return result
    }
    async getCardById(id){
        const result = await cartsModel.findById(id).populate("products.product").lean()
        logger.http("Card by id received correctly")
        return result 
    }
    async getCardByIdModify(id){
        const result = await cartsModel.findById(id)
        logger.http("Card modified by id correctly")
        return result 
    }
    async deleteCartProducts(idCart){
        const cart = await cartsModel.findById(idCart)
        cart.products=[]
        logger.http("Products deleted in card correctly")
        return cart.save()
    }
    async updateCart(idCart, body){
        const cart = await cartsModel.findById(idCart)
        cart.products = body
        logger.http("Card updated correctly")
        return cart.save()
    }
}

export const cartsManager = new CartsManager()