import { usersManager } from "../dao/users.dao.js";
import { hashData } from "../utils.js";
import {cartsServices} from "../services/carts.services.js"

class UsersRepository{
    constructor(dao){
        this.dao = dao
    }
    createUser = async (user) => {
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
    findById = (id) => {
        const result = usersManager.findById(id)
        return result
    }
    findByEmail = (email) => {
        const result = usersManager.findByEmail(email)
        return result
    }
}

export const userServices = new UsersRepository(usersManager)