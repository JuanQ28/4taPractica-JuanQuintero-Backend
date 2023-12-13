import { Router } from "express";
import * as cartsController from "../controllers/carts.controller.js";

const router = Router()

router.get("/", cartsController.getCarts)
router.get("/:cid", cartsController.getCardById)
router.post("/", cartsController.addCart)
router.post("/:cid/products/:pid", cartsController.addCartProduct)
router.delete("/:cid", cartsController.deleteCartProducts)
router.delete("/:cid/products/:pid", cartsController.deleteCartProduct)
router.put("/:cid", cartsController.updateCart)
router.put("/:cid/products/:pid", cartsController.updateCartProduct)

export default router