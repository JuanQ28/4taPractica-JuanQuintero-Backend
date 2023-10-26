import mongoose from "mongoose";

const URI = "mongodb+srv://elquinteje:<password>@cluster0.fy8hs8n.mongodb.net/ecommerce?retryWrites=true&w=majority"

mongoose
    .connect(URI)
    .then(() => console.log("Conectado a la base de datos"))
    .catch((error) => console.log(error))