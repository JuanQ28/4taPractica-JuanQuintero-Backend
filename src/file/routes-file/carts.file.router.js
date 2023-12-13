import { Router } from "express";
import { cartsManager } from "../dao-file/CartsManager.js";

const router = Router()

//Ruta para solicitar todos los carritos
router.get("/", async (request, response) =>{
    try {
        const products = await cartsManager.getCarts()
        response.status(200).json({message: "Carts found", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta para agregar un carrito nuevo, su id es autogenerable, y su contenido de productos se inicializa con un array vacío, por lo que no se precisa de información que viaje por el body
router.post("/", async (request, response) =>{
    try {
        const newCart = await cartsManager.addCart()
        response.status(200).json({message: "Cart created", cart: newCart})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Ruta para solicitar carritos en específico, pasando el id, o lista ids, por params
router.get("/:cid", async (request, response) =>{
    const {cid} = request.params
    try {
        const cart = await cartsManager.getCardById(cid)
        const cartFind = cart[0]
        const idNotFound = cart[1]
        if (cart == "some data are incorrect"){
            response.status(400).json({message: "some data are incorrect "})
        }
        if(!idNotFound){
            response.status(200).json({message: "Cart found", cartFind})
        }else{
            response.status(200).json({message: "Cart found", idNotFound ,cartFind})
        }
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

//Método para agregar productos a un carrito, teniendo en cuenta el id del producto y el id del carrito
router.post("/:cid/product/:pid", async (request, response) =>{
    try {
        const {cid, pid} = request.params
        const cart = await cartsManager.addCartProduct(+cid, +pid) 
        if(!cart[0]){
            return response.status(404).json({message: "Cart not found with the id provided"})
        }else if(!cart[1]){
            return response.status(404).json({message: "Product not found with the id provided"})
        }
        //Detalles del array del response
        //[0] = Nos arroja el carrito al cual se le hicieron modificaciones
        //[1] = Nos arroja la respuesta correspondiente a la existencias del producto en nuestro archivo json de productos
        //[2] = Nos arroja la posición del producto agregado en el carrito correspondiente
        response.status(200).json({message: `Product added, in cart with id:${cart[0].id} for the product with the id:${cart[0].products[cart[2]].id} in a quantity of:${cart[0].products[cart[2]].quantity}`, cart: cart[0]})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
})

export default router