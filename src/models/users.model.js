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
        enum: ["CLIENT", "ADMIN", "PREMIUM"],
        default: "CLIENT"
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carts"   
    },
    lastConnection:{
        type: String,
        default: "No connected"
    },
    documents:{
        type:[
            {
                name:{
                    type: String,
                    enum: ["personID", "adress", "accountStatus", "profilePicture"]
                },
                reference: String,
                path: String,
                _id: false
            }
        ],
        default: []
    },
    status:{
        type: [
            {   
                type: String,
                enum: ["personID", "adress", "accountStatus"],
                _id: false
            }
        ],
        default: [],
    }
})

export const usersModel = mongoose.model("users", usersSchema)