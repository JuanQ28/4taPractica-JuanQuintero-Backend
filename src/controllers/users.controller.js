import { userServices } from "../services/users.services.js"
import { compareData, generateToken } from "../tools.js";
import CustomError from "../errors/error.generator.js";
import { errors } from "../errors/errors.enum.js";
import { logger } from "../utils/logger.js";


export const restore = async (request, response) => {
    const {email, password} = request.body
    try {
        logger.info("Password restore by route")
        const user = await userServices.findByEmail(email)
        if(!user){
            return response.redirect("/login")
        }
        const passwordHashed = await hashData(password)
        user.password = passwordHashed
        await user.save()
        response.redirect("/login")
    } catch (error) {
        response.status(500).json({error})
    }
}

export const signout = async (request, response) => {
    try {
        logger.info("User signout by route")
        response.clearCookie("token").redirect("/login")
    } catch (error) {
        response.status(500).json({error})
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
        const token = generateToken({firstName, lastName, email, role, cart, userId})
        //request.session.user = token
        logger.info(`Login token: ${token}`)
        response.cookie("token", token, {httpOnly: true}).redirect("/")
    } catch (error) {
        response.status(500).json({message: error.message})
    }
}