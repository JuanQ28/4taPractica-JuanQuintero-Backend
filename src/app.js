import express from "express";
import {manager} from "./ProductManager.js";

//Creamos nuestro servidor desde express
const app = express()
//Ahora le decimos le asignamos el puerto 8080 a nuestro servidor
app.listen(8080, () => console.log("Server running in port:8080"))

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
        const product = await manager.getProductById(+pid)
        if(!product){
            response.status(404).json({message: `Product not found with the id: ${pid}`})
        }
        response.status(200).json({message: "Product found", product})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})