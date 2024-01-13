export const errorsMiddleware = (error, request, response, next) => {
    console.log(error)
    response.status(error.code || 500).json({
        message: error.message,
        name: error.name
    })
}