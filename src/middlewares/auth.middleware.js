import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { logger } from "../utils/logger.js";

export const authMiddleware = (roles) => {
    return (request, response, next) => {
        let token = request.cookies.token
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, config.key_jwt)
        }
        const {role} = token
        if(!roles.includes(role)){
            if(role === "CLIENT"){
                logger.warning(`${role} or premium not authorized`)
                return response.redirect("/")
            }else if(role === "ADMIN"){
                logger.warning(`${role} or premium not authorized`)
                return response.redirect("/admin")
            }
        }
        next()
    }
}