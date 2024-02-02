import { cartsServices } from "../services/carts.services.js";
import { productsServices } from "../services/products.services.js"
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { generateProduct } from "../utils/faker.js";
import { logger } from "../utils/logger.js";
import UserRequest from "../dtos/user.ruquest.dto.js";

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
        logger.debug("Token doesn't exist")
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {firstName, email, cart, role} = token
    const result = await productsServices.getProducts(request.query, role)
    logger.http("Home view charged")
    response.render("home", {result, user: {firstName, email, cart}})
}

const current = async (request, response) => {
    let token = request.cookies.token
    const authHeader = request.get("Authorization")
    const tokenHeader = authHeader.split(" ")[1]
    let tokenResponse
    if(!token && !authHeader){
        logger.debug("Token doesn't exist")
        return response.status(404).json({message: "Token doesn't exist"})
    }
    if(typeof token === "string"){
        tokenResponse = jwt.verify(request.cookies.token, config.key_jwt)
    }
    if(authHeader){
        tokenResponse = jwt.verify(tokenHeader, config.key_jwt)
    }
    const tokenResponseDTO = new UserRequest(tokenResponse)
    return response.status(200).json({message: "Current user available", user: tokenResponseDTO})
}

const getProductsRealTime = async (request, response) => {
    const products = await productsServices.getProducts()
    logger.http("Real time products view charged")
    response.render("realTimeProducts", {products})
}

const getCardById = async (request, response) => {
    const {cid} = request.params
    let token = request.cookies.token
    if(!token){
        logger.debug("Token doesn't exist")
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
    logger.http("Cart view charged")
    response.render("cart", {cartProducts, user: {cart}})
}

/* const chat = async (request, response) => {
    response.render("chat")
} */

const chat = async (request, response) => {
    let token = request.cookies.token
    if(!token){
        logger.debug("Token doesn't exist")
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {firstName, email, cart} = token
    logger.http("Chat view charged")
    response.render("chat", {user: {firstName, email, cart}})
}

const productDetail = async (request, response) => {
    if(!request.cookies.token){
        logger.debug("Token doesn't exist")
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
    logger.http("Product detail view charged")
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
        logger.debug("Token doesn't exist")
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {email} = token
    logger.http("Admin home view charged")
    response.render("admin", {user: {email}})
}

const adminProducts = async(request, response) => {
    let token = request.cookies.token
    if(!token){
        logger.debug("Token doesn't exist")
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {email, role} = token
    const result = await productsServices.getProducts(request.query, role)
    logger.http("Admin products view charged")
    response.render("adminProducts", {result, user: {email}})
}

const adminProductUpdate = async(request, response) => {
    const {pid} = request.params
    const productResult = await productsServices.getProductById(pid)
    let token = request.cookies.token
    if(!token){
        logger.debug("Token doesn't exist")
        return response.redirect("/login")
    }
    if(typeof token === "string"){
        token = jwt.verify(request.cookies.token, config.key_jwt)
    }
    const {email} = token
    const {_id: product_ID} = productResult
    const productId = product_ID.toString()
    const {title, description, price, stock, category} = productResult
    logger.http("Admin product detail view charged")
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
        logger.debug("Token doesn't exist")
        response.redirect("/")
    }
    logger.http("Login view charged")
    response.render("login")
}

const signup = async (request, response) => {
    if(request.cookies.token){
        logger.debug("Token doesn't exist")
        response.redirect("/")
    }
    logger.http("Signup view charged")
    response.render("signup")
}

const restore = async (request, response) => {
    if(request.cookies.token){
        logger.debug("Token doesn't exist")
        response.redirect("/")
    }
    logger.http("Restore view charged")
    response.render("restore")
}

const mockingProducts = async (request, response) => {
    const products = []
    for(let i = 0; i < 100; i++){
        const product = generateProduct()
        products.push(product)
    }
    logger.http("Mocking view charged")
    return response.status(200).json({message: "Mocking generated", products})
}

const loggerTest = async (request, response) => {
    logger.fatal("Fatal level test")
    logger.error("Error level test")
    logger.warning("Warning level test")
    logger.info("Info level test")
    logger.http("HTTP lvel test")
    logger.debug("Debug level test")
    return response.status(200).json({message: "Realized Test"})
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
    mockingProducts,
    loggerTest
}