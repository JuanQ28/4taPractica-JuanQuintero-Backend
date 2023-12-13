import * as cartsServices from "../services/carts.services.js";
import * as producstServices from "../services/products.services.js"

const getProductsHome = async (request, response) => {
    const result = await producstServices.getProducts(request.query)
    if(!request.session.passport){
        return response.redirect("/login")
    }
    const currentUser = await request.user
    const {firstName, email} = currentUser
    request.session.user = currentUser
    console.log("principal:", request.session)
    response.cookie("currentUser", currentUser, {maxAge: 12000}).render("home", {result, user: {firstName, email}})
}

const current = async (request, response) => {
    const current = request.user
    //console.log("Usuario current:" , current)
    console.log(request.session)
    return response.status(200).json({message: "Current user available", user: current})
}

const getProductsRealTime = async (request, response) => {
    const products = await producstServices.getProducts()
    response.render("realTimeProducts", {products})
}

const getCardById = async (request, response) => {
    const {cid} = request.params
    const cartProducts = await cartsServices.getCardById(cid)
    response.render("cart", {cartProducts})
}

const chat = async (request, response) => {
    response.render("chat")
}

const login = async (request, response) => {
    console.log("principal login:", request.session)
    if(request.session.passport){
        response.redirect("/")
    }
    response.render("login")
}

const signup = async (request, response) => {
    if(request.session.passport){
        response.redirect("/")
    }
    response.render("signup")
}

const restore = async (request, response) => {
    if(request.session.passport){
        response.redirect("/")
    }
    response.render("restore")
}

export {
    getProductsHome,
    current,
    getProductsRealTime,
    getCardById,
    chat,
    login,
    signup,
    restore
}