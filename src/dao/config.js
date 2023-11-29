import mongoose from "mongoose";
import { config } from "dotenv";

const dotenv = config()

const URI = `mongodb+srv://elquinteje:${process.env.URI_PASSWORD}@cluster0.fy8hs8n.mongodb.net/ecommerce?retryWrites=true&w=majority`


mongoose
    .connect(URI)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log(error))