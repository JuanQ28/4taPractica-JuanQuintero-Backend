import { cartsServices } from "../services/carts.services.js";
import { productsServices } from "../services/products.services.js"
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { generateProduct } from "../faker.js";

/* const getProductsHome = async (request, response) => {
    const result = await productsServices.getProducts(request.query)
    if(!request.session.passport){
        return response.redirect("/login")
    }
    const currentUser = await request.user
    const {firstName, email} = currentUser
    request.session.user = currentUser
    console.log("principal:", request.session)
    response.cookie("currentUser", currentUser, {maxAge: 12000}).render("home", {result, user: {firstName, email}})
} */

const getProductsHome = async (request, response) => {
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {firstName, email, cart, role} = token
    const result = await productsServices.getProducts(request.query, role)
    response.render("home", {result, user: {firstName, email, cart}})
}

const current = async (request, response) => {
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    console.log(token)
    const current = jwt.verify(token, config.key_jwt)
    //console.log("Usuario current:" , current)
    return response.status(200).json({message: "Current user available", user: current})
}

const getProductsRealTime = async (request, response) => {
    const products = await productsServices.getProducts()
    response.render("realTimeProducts", {products})
}

const getCardById = async (request, response) => {
    const {cid} = request.params
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {cart} = token
    const cartProductsNotCart = await cartsServices.getCardById(cid)
    const cartProducts = cartProductsNotCart.products.map(product => {
        return {...product, cart}
    })
    response.render("cart", {cartProducts, user: {cart}})
}

/* const chat = async (request, response) => {
    response.render("chat")
} */

const chat = async (request, response) => {
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {firstName, email, cart} = token
    response.render("chat", {user: {firstName, email, cart}})
}

const productDetail = async (request, response) => {
    if(!request.cookies.token){
        response.redirect("/")
    }
    let token = request.cookies.token
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {cart: userCart, email: userEmail} = token
    const {id} = request.params
    const productResult = await productsServices.getProductById(id)
    const {_id, title, category, price, stock, thumbnail, status, code, description} = productResult
    response.render("productDetail", {product: {
        _id, 
        title, 
        category, 
        price, 
        stock, 
        thumbnail, 
        status,
        code, 
        description,
        userCart,
        userEmail
    }})
}

const adminHome = async (request, response) => {
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {email} = token
    response.render("admin", {user: {email}})
}

const adminProducts = async(request, response) => {
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {email, role} = token
    const result = await productsServices.getProducts(request.query, role)
    response.render("adminProducts", {result, user: {email}})
}

const adminProductUpdate = async(request, response) => {
    const {pid} = request.params
    const productResult = await productsServices.getProductById(pid)
    let token = request.cookies.token
    if(!token){
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {email} = token
    const {_id: product_ID} = productResult
    const productId = product_ID.toString()
    const {title, description, price, stock, category} = productResult
    response.render("adminProductDetail", {user: {email}, product: {
        title,
        description,
        price,
        stock,
        category,
        productId
    }})
}

const login = async (request, response) => {
    if(request.cookies.token){
        response.redirect("/")
    }
    response.render("login")
}

const signup = async (request, response) => {
    if(request.cookies.token){
        response.redirect("/")
    }
    response.render("signup")
}

const restore = async (request, response) => {
    if(request.cookies.token){
        response.redirect("/")
    }
    response.render("restore")
}

const mockingProducts = async (request, response) => {
    const products = []
    for(let i = 0; i < 100; i++){
        const product = generateProduct()
        products.push(product)
    }
    return response.status(500).json({message: "Mocking generated", products})
}

export {
    getProductsHome,
    current,
    getProductsRealTime,
    getCardById,
    chat,
    login,
    signup,
    restore,
    productDetail,
    adminHome, 
    adminProducts,
    adminProductUpdate,
    mockingProducts
}