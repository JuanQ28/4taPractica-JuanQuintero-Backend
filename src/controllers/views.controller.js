import { cartsServices } from "../services/carts.services.js";
import { productsServices } from "../services/products.services.js"
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { generateProduct } from "../utils/faker.js";
import { logger } from "../utils/logger.js";
import UserRequest from "../dtos/user.request.dto.js";
import { userServices } from "../services/users.services.js"; 

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
    let {firstName, email, cart, role, userId} = token
    const user = {firstName, email, cart, isPremium: false, userId}
    if(role === "PREMIUM"){
        user.isPremium = true
    }
    let result = await productsServices.getProducts(request.query, role)
    for(let i = 0; i <= result.payload.length-1; i++){
        const randomImage = Math.floor(Math.random() * ((result.payload[i].thumbnail.length)))
        result.payload[i].thumbnail = result.payload[i].thumbnail[randomImage].reference
    }
    logger.http("Home view charged")
    response.render("home", {result, user})
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
    const {cart, role} = token
    const user = {cart, isPremium: false}
    if(role === "PREMIUM"){
        user.isPremium = true
    }
    const cartProductsNotCart = await cartsServices.getCardById(cid)
    const cartProducts = cartProductsNotCart.products.map(product => {
        return {...product, cart}
    })
    logger.http("Cart view charged")
    response.render("cart", {cartProducts, user})
}

const getProfile = async (request, response) => {
    let token = request.cookies.token
    try {
        let status = {
            personID: false,
            adress: false,
            accountStatus: false
        }
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        const {firstName, email, cart, role, userId} = token
        const userFound = await userServices.findById(userId)
        if(userFound.status.length){
            userFound.status.forEach(state => {
                status[state] = true
            })
        }
        console.log(status)
        const user = {firstName, email, cart, isPremium: false}
        if(role === "PREMIUM"){
            user.isPremium = true
        }
        logger.http("Profile view charged")
        response.render("profile", {user, status})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
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
    const {firstName, email, cart, role} = token
    const user = {firstName, email, cart, isPremium: false}
    if(role === "PREMIUM"){
        user.isPremium = true
    }
    logger.http("Chat view charged")
    response.render("chat", {user})
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

    const {firstName, email: userEmail, cart: userCart, role} = token
    const user = {firstName, userEmail, userCart, isPremium: false}
    if(role === "PREMIUM"){
        user.isPremium = true
    }
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
    }, user})
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
    let {email, cart, role, _id} = token
    const user = {email, cart, isPremium: false, isAdmin: false, _id}
    if(role === "PREMIUM"){
        user.isPremium = true
        role = "ADMIN"
    }else if(role === "ADMIN"){
        user.isAdmin = true
    }
    const result = await productsServices.getProducts(request.query, role)
    logger.http("Admin products view charged")
    response.render("adminProducts", {result, user})
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

const adminRoles = async (request, response) => {
    try {
        let token = request.cookies.token
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        const {email} = token
        const result = await userServices.getUsers()
        const resultNotAdmin = result.filter((user) => {
            console.log(user.status)
            return user.role !== "ADMIN" && user.status.includes("personID") && user.status.includes("adress") && user.status.includes("accountStatus")
        })
        const resultCompleted = resultNotAdmin.map(user => {
            if(user.role === "CLIENT"){
                return {...user, isClient: true} 
            }else{
                return {...user, isClient: false}
            }
        })
        console.log(result)
        logger.http("Admin users view charged")
        response.render("adminUsers", {resultCompleted, user: {email}})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
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

const restorePassword = async (request, response) => {
    const {id} = request.params
    const responseAuth = request.cookies.restoreCookie
    try {
        const user = await userServices.findById(id)
        if(!responseAuth){
            return response.render("restorePasswordBad")
        }
        if(!user){
            return response.render("login")
        }
        const userResult = await userServices.findById(id)
        const {_id, firstName, lastName} = userResult
        response.render("restorePasswordGood", {user: {_id, firstName, lastName}})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
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
    restorePassword,
    productDetail,
    adminHome, 
    adminProducts,
    adminProductUpdate,
    mockingProducts,
    loggerTest,
    getProfile,
    adminRoles,
    restore
}