import { Router } from "express";
import { productsManager } from "../dao/manager-mongo/ProductManager.mongo.js";
import { cartsManager } from "../dao/manager-mongo/CartsManager.mongo.js";
import jwt from "jsonwebtoken";

const router = Router()

router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    if(!request.session.passport){
        return response.redirect("/login")
    }
    const {name, email} = await request.user
    response.render("home", {result, user: {name, email}})
})

/* router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    console.log("token" ,request.cookies.token)
    if(!request.cookies.token){
        return response.redirect("/login")
    }
    const userToken = jwt.verify(request.cookies.token, "Proyecto47315")
    console.log("UserToken", userToken)
    const {name, email} = userToken
    response.render("home", {result, user: {name, email}})
}) */

router.get("/products/realtimeproducts", async (request, response) => {
    const products = await productsManager.getProducts()
    response.render("realTimeProducts", {products})
})

router.get("/cart/:cid", async (request, response) => {
    const {cid} = request.params
    const cartProducts = await cartsManager.getCardById(cid)
    response.render("cart", {cartProducts})
})

router.get("/chat", async (request, response) => {
    response.render("chat")
})

router.get("/login", async (request, response) => {
    if(request.cookies.token){
        response.redirect("/")
    }
    response.render("login")
})

router.get("/signup", async (request, response) => {
    if(request.cookies.token){
        response.redirect("/")
    }
    response.render("signup")
})

router.get("/restore", async (request, response) => {
    if(request.cookies.token){
        response.redirect("/")
    }
    response.render("restore")
})

export default router