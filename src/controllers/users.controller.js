import { findByEmail } from "../services/users.services.js"

export const restore = async (request, response) => {
    const {email, password} = request.body
    try {
        const user = await findByEmail(email)
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
        request.session.destroy(() => {
            response.redirect("/login")
        })
    } catch (error) {
        response.status(500).json({error})
    }
}