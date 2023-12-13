import { Router } from "express";
import { productsManager } from "../dao/products.dao.js";
import * as cartsController from "../controllers/carts.controller.js";
import * as producstServices from "../services/products.services.js"
//import jwt from "jsonwebtoken";

const router = Router()

//Mala práctica: sessions y jwt en paralelo
/* router.get("/", async (request, response) => {
    const result = await productsManager.getProducts(request.query)
    console.log("token" , request.cookies.token)
    console.log("session", request.session.passport)
    if(!request.cookies.token && !request.session.passport){
        return response.redirect("/login")
    }else if(request.cookies.token){
        const userToken = jwt.verify(request.cookies.token, "Proyecto47315")
        const {name, email} = userToken
        return response.render("home", {result, user: {name, email}})
    }else if(request.session.passport){
        const {name, email} = await request.user
        return response.render("home", {result, user: {name, email}})
    }
}) */

router.get("/", async (request, response) => {
    const result = await producstServices.getProducts(request.query)
    if(!request.session.passport){
        return response.redirect("/login")
    }
    const currentUser = await request.user
    const {firstName, email} = currentUser
    request.session.user = currentUser
    console.log("principal:", request.session)
    response.cookie("currentUser", currentUser, {maxAge: 12000}).render("home", {result, user: {firstName, email}})
})

router.get("/current", async (request, response) => {
    const current = request.session.user
    //console.log("Usuario current:" , current)
    console.log(request)
    return response.status(200).json({message: "Current user available", user: current})
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
    const products = await producstServices.getProducts()
    response.render("realTimeProducts", {products})
})

router.get("/cart/:cid", async (request, response) => {
    const {cid} = request.params
    const cartProducts = await cartsController.getCardById(cid)
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