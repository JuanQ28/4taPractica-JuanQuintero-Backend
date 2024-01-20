import { logger } from "../utils/logger.js"

export const errorsMiddleware = (error, request, response, next) => {
    logger.error(error.message)
    response.status(error.code || 500).json({
        message: error.message,
        name: error.name
    })
}