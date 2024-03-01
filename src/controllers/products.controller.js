import { productsServices } from "../services/products.services.js"
import { v4 as uuidv4 } from 'uuid'
import { removeEmpty } from "../tools.js"
import { logger } from "../utils/logger.js"

const getProducts = async (request, response) => {
    try {
        logger.info("Products received by route")
        const result = await productsServices.getProducts(request.query)
        response.status(200).json({message: "Products", result})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const addProducts = async (request, response) => {
    try {
        const files = request.files
        let token = request.cookies.token || undefined
        let userRole = undefined
        let userEmail
        let product = request.body
        /* if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        } */
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        //const {email, role} = token
        if(token){
            const {email, role} = token
            userRole = role
            userEmail = email
        }
        let filesNamePath = []
        /* filesNamePath = files.forEach(file => {
            filesNamePath.push({
                name: file.originalname,
                reference: file.path
            })
        }); */
        for(let i = 0; i <= files.length-1; i++){
            filesNamePath.push({
                name: files[i].filename,
                reference: `http://localhost:8080/multerDocs/${files[i].fieldname}/${files[i].filename}`,
                path: files[i].path
            })
        }
        product = {...product, thumbnail: filesNamePath, code: uuidv4()}
        if(userRole === "PREMIUM"){
            product = {...product, owner: userEmail}
        }
        console.log(product)
        logger.info("Product added by route")
        await productsServices.addProducts(product)
        response.redirect("/admin/products")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const getProductById = async (request, response) => {
    const {pid} = request.params
    try {
        logger.info("Product received for id by route")
        const products = await productsServices.getProductById(pid)
        if(!products){
            response.status(404).json({message: "Product not found"})
        }
        response.status(200).json({message: "Products", products})
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const updateProduct = async (request, response) => {
    const {pid} = request.params
    try {
        logger.info("Product updated by route")
        const productUpdates = removeEmpty(request.body)
        await productsServices.updateProduct(pid, productUpdates)
        response.redirect(`http://localhost:8080/admin/products/${pid}`)
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

const deleteProduct = async (request, response) => {
    const {pid} = request.params
    try {
        let token = request.cookies.token || undefined
        let emailUser = undefined
        /* if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        } */
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        if(token){
            const {email} = token
            emailUser = email
        }
        const product = await productsServices.getProductById(pid)
        //const {email} = token
        if(product.owner !== emailUser && emailUser){
            return response.status(401).json({message: "You are not authorized to remove this product"})
        }
        logger.info("Product deleted by route")
        await productsServices.deleteProduct(pid)
        response.redirect("/admin/products")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

export {
    getProducts,
    addProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
