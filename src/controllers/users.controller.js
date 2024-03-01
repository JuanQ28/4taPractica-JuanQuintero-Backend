import { userServices } from "../services/users.services.js"
import { compareData, generateToken } from "../tools.js";
import CustomError from "../errors/error.generator.js";
import { errors } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";
import {transporter} from "../utils/nodemailer.js"


export const restore = async (request, response) => {
    const {email} = request.body
    try {
        logger.info("Password restore request")
        const user = await userServices.findByEmail(email)
        if(!user){
            return response.redirect("/login")
        }
        const mailOptions = {
            from: "JuanAdmin",
            to: email,
            subject: "Recuperación de Contraseña",
            html: 
                `<h1>Ingresa al siguiente link:</h1>
                http://localhost:8080/restore/${user._id}`
        }
        await transporter.sendMail(mailOptions)
        response.cookie("restoreCookie", true, {httpOnly: true, maxAge: 3600000}).redirect("/login")
    } catch (error) {
        response.status(500).json({error})
    }
}

export const signout = async (request, response) => {
    let token = request.cookies.token
    try {
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        const {userId} = token
        const user = await userServices.findById(userId)
        user.lastConnection = new Date().toLocaleString()
        await user.save()
        logger.info("User signout by route")
        response.clearCookie("token").redirect("/login")
    } catch (error) {
        response.status(500).json({error: error.message})
    }
}

export const login = async (request, response) => {
    const {email: emailUser, password} = request.body
    try {
        logger.info("User login by route")
        const user = await userServices.findByEmail(emailUser)
        if(!user){
            return response.redirect("/login")
        }
        const isPasswordValid = await compareData(password, user.password)
        if(!isPasswordValid){
            logger.warning("Bad credentials by user")
            return CustomError.generateError(errors.INVALID_CREDENTIALS.message, errors.INVALID_CREDENTIALS.code, errors.INVALID_CREDENTIALS.name)
        }
        const {firstName, lastName, email, role, cart, _id} = user
        const userId = _id.toString()
        user.lastConnection = new Date().toLocaleString()
        await user.save()
        const token = generateToken({firstName, lastName, email, role, cart, userId})
        //request.session.user = token
        logger.info(`Login token: ${token}`)
        response.cookie("token", token, {httpOnly: true}).redirect("/")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}

export const restoreUserPassword = async (request, response) => {
    const {id} = request.params
    const {password1, password2} = request.body
    try {
        const user = await userServices.findById(id)
        const isPasswordValid1 = await compareData(password1, user.password)
        const isPasswordValid2 = await compareData(password2, user.password)
        if(!user){
            return response.render("/login")
        }
        if(isPasswordValid1 || isPasswordValid2){
            return response.status(401).json({message: "Cambia tu contraseña, coíncide con la anterior"})
        }
        if(password1 !== password2){
            return response.status(401).json({message: "No coinciden las contraseñas"})
        }
        const hashPassword = await hashData(password1)
        user.password = hashPassword
        await user.save()
        logger.info("An user change password correctly")
        return response.clearCookie("responseAuth").render("login")
    } catch (error) {
        response.status(500).json({error})
    }
}

export const cancelRole = async (request, response) => {
    const {id} = request.params
    try {
        const user = await userServices.findById(id)
        let token = request.cookies.token
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        if(!user){
            return  response.redirect("http://localhost:8080/admin/usersRoles")
        }
        user.status = []
        user.documents = []
        await user.save()
        return response.redirect("http://localhost:8080/admin/usersRoles")
    } catch (error) {
        response.status(500).json({error})
    }
}

export const changueRole = async (request, response) => {
    const {id} = request.params
    try {
        const user = await userServices.findById(id)
        let token = request.cookies.token
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        if(!user){
            return response.render("/login")
        }
        if(user.role === "CLIENT"){
            user.role = "PREMIUM"
            await user.save()
        }else if(user.role === "PREMIUM"){
            user.role = "CLIENT"
            user.status = []
            user.documents = []
            await user.save()
        }
        const {email} = token
        const result = await userServices.getUsers()
        const resultNotAdmin = result.filter((user) => user.role !== "ADMIN")
        //response.render("adminUsers", {resultNotAdmin, user: {email}})
        logger.info(`Role changed at the user: ${user.firstName} ${user.lastName}`)
        logger.http("Admin users view charged")
        return response.redirect("http://localhost:8080/admin/usersRoles")
        //return response.render("adminUsers", {resultNotAdmin, user: {email}})
    } catch (error) {
        response.status(500).json({error})
    }
}

export const documents = async (request, response) => {
    try {
        const {personID, adress, accountStatus} = request.files
        let token = request.cookies.token || undefined
        console.log("account status: ", request.files.accountStatus)
        if(!token){
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        const {userId} = token
        const user = await userServices.findById(userId)
        let userDocuments = user.documents || []
        let userStatus = user.status || []
        if(!user.status.includes("personID") && personID){
            userStatus.push(personID[0].fieldname)
            userDocuments.push({
                name: personID[0].fieldname,
                reference: `http://localhost:8080/multerDocs/${personID[0].fieldname}/${personID[0].filename}`,
                path: personID[0].path
            })
        }
        if(!user.status.includes("adress") && adress){
            userStatus.push(adress[0].fieldname)
            userDocuments.push({
                name: adress[0].fieldname,
                reference: `http://localhost:8080/multerDocs/${adress[0].fieldname}/${adress[0].filename}`,
                path: adress[0].path
            })
        }
        if(!user.status.includes("accountStatus") && accountStatus){
            userStatus.push(accountStatus[0].fieldname)
            userDocuments.push({
                name: accountStatus[0].fieldname,
                reference: `http://localhost:8080/multerDocs/${accountStatus[0].fieldname}/${accountStatus[0].filename}`,
                path: accountStatus[0].path
            })
        }
        if(!user.status.includes("accountStatus") && accountStatus ||
        !user.status.includes("adress") && adress ||
        !user.status.includes("personID") && personID){
            user.status = userStatus
            user.documents = userDocuments
        }
        await user.save()
        logger.info("Documents added by route")
        response.redirect("http://localhost:8080/profile")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}