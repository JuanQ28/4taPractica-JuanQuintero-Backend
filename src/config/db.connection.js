import mongoose from "mongoose";
import config from "./config.js";

const URI = `mongodb+srv://elquinteje:${config.mongo_uri}@cluster0.fy8hs8n.mongodb.net/${config.mongo_db_name}?retryWrites=true&w=majority`

mongoose
    .connect(URI)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log(error))