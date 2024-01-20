import { Router } from "express";
import * as cartsController from "../controllers/carts.controller.js";
import { cartsManager } from "../dao/carts.dao.js";
import { v4 as uuidv4 } from 'uuid'
import { ticketsModel } from "../models/tickets.model.js";
import config from "../config/config.js";
import { logger } from "../utils/logger.js";

const router = Router()

router.get("/", cartsController.getCarts)
router.get("/:cid", cartsController.getCardById)
router.post("/", cartsController.addCart)
router.post("/:cid/products/:pid", cartsController.addCartProduct)
router.delete("/:cid", cartsController.deleteCartProducts)
//Este ha de ser delete:
router.post("/:cid/deleteProduct/:pid", cartsController.deleteCartProduct)
router.put("/:cid", cartsController.updateCart)
router.put("/:cid/products/:pid", cartsController.updateCartProduct)

router.post("/:cid/purchase", async(request, response) => {
    const {cid} = request.params
    let token = request.cookies.token
    console.log(token)
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {userId} = token
    try {
        const cart = await cartsManager.getCardById(cid)
        let availableProducts = []
        let unavailableProducts = []
        let totalAmount = 0
        for (let item of cart.products){
            if(item.product.stock >= item.quantity){
                availableProducts.push(item)
                item.product.stock -= item.quantity
                await item.product.save()
                totalAmount += item.quantity * item.product.price
            }else{
                unavailableProducts.push(item)
            }
        }
        cart.products = unavailableProducts
        await cart.save()
        if(availableProducts.length){
            const ticket = {
                code: uuidv4(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userId
            }
            await ticketsModel.create(ticket)
            return {availableProducts, totalAmount}
        }
        return {unavailableProducts}
    } catch (error) {
        logger.error(error.message)
    }
})

export default router