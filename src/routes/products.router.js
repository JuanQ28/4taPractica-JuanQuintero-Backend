import { Router } from "express";
import * as producstController from "../controllers/products.controller.js"
import upload from "../middlewares/multer.middleware.js";

const router = Router()

router.get("/", producstController.getProducts)
router.post("/", upload.array("product", 3),producstController.addProducts)
router.get("/:pid", producstController.getProductById)
router.post("/updateProduct/:pid", producstController.updateProduct)
router.post("/deleteProduct/:pid", producstController.deleteProduct)

/* router.delete("/:pid", async (request, response) => {
    const {pid} = request.params
    try {
        const products = await producstController.deleteProduct(pid)
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}) */

export default router