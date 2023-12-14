import { usersManager } from "../dao/users.dao.js";
import { hashData } from "../utils.js";
import * as cartsServices from "../services/carts.services.js"

export const createUser = async (user) => {
    const passwordHashed = await hashData(user.password)
    const cartUser = await cartsServices.addCart()
    const newUser = {
        ...user,
        cart: cartUser._id,
        password: passwordHashed
    }
    const result = usersManager.createUser(newUser) 
    return result
}
export const findById = (id) => {
    const result = usersManager.findById(id)
    return result
}
export const findByEmail = (email) => {
    const result = usersManager.findByEmail(email)
    return result
}