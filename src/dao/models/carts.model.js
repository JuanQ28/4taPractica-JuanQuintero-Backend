import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartsSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type: mongoose.SchemaTypes.ObjectId,
                ref: "products"
            },
            quantity:{
                type: Number
            },
            _id: false
        }
    ]
})

cartsSchema.plugin(mongoosePaginate)

export const cartsModel = mongoose.model("carts", cartsSchema)