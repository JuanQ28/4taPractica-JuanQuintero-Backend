import { messagesModel } from "../models/messages.model.js";
import { logger } from "../utils/logger.js";

class MessagesManager {
    async getMessages(){
        const result = await messagesModel.find()
        logger.http("Messages received correctly")
        return result
    }
    async addMessage(message){
        const result = await messagesModel.create(message)
        logger.http("Message added correctly")
        return result
    }
}

export const messagesManager = new MessagesManager()