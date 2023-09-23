import express from "express";
import {manager} from "./ProductManager.js";

//Creamos nuestro servidor desde express
const app = express()
//Ahora le permitimos a nuestro servidor recibir información desde el body
app.use(express.json())
//Ahora le decimos le asignamos el puerto 8080 a nuestro servidor
app.listen(8080, () => console.log("Server running in port:8080"))


/////////////////////////////////////////////////////////////////
////////////////////////////EndPoints////////////////////////////
/////////////////////////////////////////////////////////////////

//Ruta para solicitar todos los productos, con la libertad de escoger el límite (limit) de los mismos
app.get("/api/products", async (request, response) =>{
    try {
        const products = await manager.getProducts(request.query)
        response.status(200).json({message: "Products found", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta para solicitar un producto en específico, por medio de su id
app.get("/api/products/:pid", async (request, response) =>{
    const {pid} = request.params
    try {
        const product = await manager.getProductById(pid)
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
app.post("/api/products", async (request, response) =>{
    try {
        const {title, price, code} = request.body
        if(!title || !price || !code){
            return response.status(400).json({message: "Some data is missing"})
        }
        const newProduct = await manager.addProduct(request.body)
        response.status(200).json({message: "Product created", product: newProduct})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta en la que podemos actualizar un producto suministrando el id y la información a cambiar por el body
app.put("/api/products/:idProdt", async (request, response) =>{
    const {idProdt} = request.params
    try {
        const result = await manager.updateProduct(+idProdt, request.body)
        if(!result){
            return response.status(404).json({message: "Product not found with the id provided"})
        }
        response.status(200).json({message: "Updated product"})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta en la que podemos eliminar un producto suministrándole su id correspondiente
app.delete("/api/products/:idProdt", async (request, response) =>{
    const {idProdt} = request.params
    try {
        const result = await manager.deleteProduct(+idProdt)
        if(!result){
            return response.status(404).json({message: "Product not found with the id provided"})
        }
        response.status(200).json({message: "Eliminated product"})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})