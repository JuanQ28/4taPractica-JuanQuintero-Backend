import { config } from "dotenv";

const dotenv = config()

export default {
    mongo_uri: process.env.URI_PASSWORD,
    port: process.env.PORT,
    mongo_db_name: process.env.MONGO_DB_NAME
}