import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { logger } from "../utils/logger.js";

export const JWTIsExpired = async (request, response, next) => {
    const token = request.cookies.token
        if(token){
            if(typeof token === "string"){
                const userToken = jwt.verify(token, config.key_jwt)
                const { exp } = userToken;
                if (exp <= (Math.floor((new Date()).getTime() / 1000))) {
                    logger.debug("Token expired")
                    return response.clearCookie("token").redirect("/login")
                }else {
                    logger.debug("Token renovated")
                    response.cookie("token", userToken, {httpOnly: true})
                    next()
                }                
            }else{
                const { exp } = token;
                if (exp <= (Math.floor((new Date()).getTime() / 1000))) {
                    logger.debug("Token expired")
                    return response.clearCookie("token").redirect("/login")
                }else {
                    logger.debug("Token renovated")
                    response.cookie("token", token, {httpOnly: true})
                    next()
                }
            }
        } else{
            logger.debug("Token doesn't exist")
            return response.redirect("/login")
        }
}
