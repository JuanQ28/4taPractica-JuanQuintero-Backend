import { messagesModel } from "../models/messages.model.js";

class MessagesManager {
    async getMessages(){
        const result = await messagesModel.find()
        return result
    }
    async addMessage(message){
        const result = await messagesModel.create(message)
        return result
    }
}

export const messagesManager = new MessagesManager()