import { Router } from "express";
import {productManager} from "../manager/ProductManager.js";


const router = Router()

//Ruta para solicitar todos los productos, con la libertad de escoger el límite (limit) de los mismos
router.get("/", async (request, response) =>{
    try {
        const products = await productManager.getProducts(request.query)
        response.status(200).json({message: "Products found", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta para solicitar un producto en específico, por medio de su id
router.get("/:pid", async (request, response) =>{
    const {pid} = request.params
    try {
        const product = await productManager.getProductById(pid)
        const productFind = product[0]
        const idNotFound = product[1]
        if (product == "some data are incorrect"){
            response.status(400).json({message: "some data are incorrect "})
        }
        if(!idNotFound){
            response.status(200).json({message: "Product found", productFind})
        }else{
            response.status(200).json({message: "Product found", idNotFound ,productFind})
        }
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta para agregar un producto, suministrando la infoamción desde el body
router.post("/", async (request, response) =>{
    try {
        const {title, description, code, price, stock, category} = request.body
        if(!title || !description || !code || !price || !stock || !category){
            return response.status(400).json({message: "Some data is missing"})
        }
        const newProduct = await productManager.addProduct(request.body)
        response.status(200).json({message: "Product created", product: newProduct})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta en la que podemos actualizar un producto suministrando el id y la información a cambiar por el body
router.put("/:idProdt", async (request, response) =>{
    const {idProdt} = request.params
    try {
        const result = await productManager.updateProduct(+idProdt, request.body)
        if(!result){
            return response.status(404).json({message: "Product not found with the id provided"})
        }
        response.status(200).json({message: "Updated product"})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta en la que podemos eliminar un producto suministrándole su id correspondiente
router.delete("/:idProdt", async (request, response) =>{
    const {idProdt} = request.params
    try {
        const result = await productManager.deleteProduct(+idProdt)
        if(!result){
            return response.status(404).json({message: "Product not found with the id provided"})
        }
        response.status(200).json({message: "Eliminated product"})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})


///////////////////////////////////////
//Rutas de formularios//Handlebars
///////////////////////////////////////


//Suena rebuntante, pero es para no manipular los endpoints anteriormente creados
router.post("/addProduct", async (request, response) =>{
    try {
        const {title, description, code, price, stock, category} = request.body
        if(!title || !description || !code || !price || !stock || !category){
            return response.status(400).json({message: "Some data is missing"})
        }
        const newProduct = await productManager.addProduct(request.body)
        /* response.status(200).json({message: "Product created", product: newProduct}) */
        response.redirect("/realtimeproducts")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})
router.post("/deleteProduct", async (request, response) =>{
    const {code} = request.body
    try {
        const result = await productManager.deleteProductWithCode(code)
        if(!result){
            return response.status(404).json({message: "Product not found with the id provided"})
        }
        /* response.status(200).json({message: "Eliminated product"}) */
        response.redirect("/realtimeproducts")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})


export default router;