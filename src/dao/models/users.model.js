import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    firstName:{
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
    auth:{
        type: String,
        enum: ["GOOGLE", "GITHUB", "NONE"],
        default: "NONE"
    },
    role:{
        type: String,
        enum: ["CLIENT", "ADMIN"],
        default: "CLIENT"
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carts"   
    }
})

export const usersModel = mongoose.model("users", usersSchema)