import dotenv from "dotenv";

dotenv.config()

export default {
    mongo_uri: process.env.URI_PASSWORD,
    port: process.env.PORT,
    mongo_db_name: process.env.MONGO_DB_NAME,
    key_jwt: process.env.SECRET_KEY_JWT
}