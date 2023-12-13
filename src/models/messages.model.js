import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
})

export const messagesModel =  mongoose.model("messages", messagesSchema)