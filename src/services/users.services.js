import { usersManager } from "../dao/users.dao.js";
import { hashData } from "../tools.js";
import {cartsServices} from "../services/carts.services.js"
import CustomError from "../errors/error.generator.js";
import { errors } from "../errors/errors.enum.js";

class UsersRepository{
    constructor(dao){
        this.dao = dao
    }
    createUser = async (user) => {
        const userCurrent = await this.findByEmail(user.email)
        if(userCurrent){
            return CustomError.generateError(errors.USER_ALREADY_EXISTS.message, errors.USER_ALREADY_EXISTS.code, errors.USER_ALREADY_EXISTS.name)
        }
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
        if(!result){
            return CustomError.generateError(errors.USER_NOT_FOUND.message, errors.USER_NOT_FOUND.code, errors.USER_NOT_FOUND.name)
        }
        return result
    }
    findByEmail = (email) => {
        const result = usersManager.findByEmail(email)
        return result
    }
    getUsers = () => {
        const result = usersManager.getUsers()
        return result
    }
    updateUser = (id, object) => {
        const result = usersManager.updateUser(id, object)
        return result
    }
    deleteUser = (id) => {
        const result = usersManager.deleteUser(id)
        return result
    }
}

export const userServices = new UsersRepository(usersManager)