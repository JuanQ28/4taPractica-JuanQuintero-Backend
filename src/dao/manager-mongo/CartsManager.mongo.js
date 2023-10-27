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
        const result = await cartsModel.findById(id)
        return result 
    }
}

export const cartsManager = new CartsManager()