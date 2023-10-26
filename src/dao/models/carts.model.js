import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products:{
        type: Array,
        default: []
    }
})

export const cartsModel = mongoose.model("carts", cartsSchema)