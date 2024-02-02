import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        /* type: mongoose.SchemaTypes.ObjectId, */
        type: String,
        ref: "users"
    }
})

export const ticketsModel = mongoose.model("tickets", ticketsSchema)