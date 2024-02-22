import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        default: "Default description"
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    owner:{
        type: String,
        default: "ADMIN"
    },
    price:{
        type: Number,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    },
    stock:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
        enum: ["proteina", "creatina", "preenetreno", "aminoacidos", "multivitaminicos"],
        required: true
    },
    thumbnail:{
        type: String,
        default: "/assets/imageNotFound.png"
    }
})

productsSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model("products", productsSchema)
