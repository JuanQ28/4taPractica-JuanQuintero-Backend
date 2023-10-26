import { cartsModel } from "../models/carts.model.js";

class CartsManager {
    async getCarts(){
        const result = await cartsModel.find()
        return result 
    }
    async addCart(){
        const result = await cartsModel.create()
        return result
    }
    /* async addCartProduct(){

    } */
    async getCardById(id){
        const result = await cartsModel.findById(id)
        return result 
    }
}

export const cartsManager = new CartsManager()