import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isGithub:{
        type: Boolean,
        default: false
    }
})

export const usersModel = mongoose.model("users", usersSchema)