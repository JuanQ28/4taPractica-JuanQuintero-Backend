import { usersModel } from "../models/users.model.js"

class UsersManager {
    async createUser(user){
        const result = await usersModel.create(user)
        return result
    }
    async findById(id){
        const result = await usersModel.findById(id)
        return result
    }
    async findByEmail(email){
        const result = await usersModel.findOne({email})
        return result
    }
}

export const usersManager = new UsersManager()