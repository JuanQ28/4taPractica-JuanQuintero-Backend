import jwt from "jsonwebtoken";

export const authMiddleware = (roles) => {
    return (request, response, next) => {
        let token = request.cookies.token
        if(typeof token === "string"){
            token = jwt.verify(request.cookies.token, "Proyecto47315")
        }
        const {role} = token
        if(!roles.includes(role)){
            if(role === "CLIENT"){
                return response.redirect("/")
            }else if(role === "ADMIN"){
                return response.redirect("/admin")
            }
        }
        next()
    }
}