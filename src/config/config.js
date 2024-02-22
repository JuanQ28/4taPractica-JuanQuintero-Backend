import dotenv from "dotenv";
import { Arg } from "./commander.js";


//const {mode} = Arg
dotenv.config()
/* dotenv.config({
    path:
        mode === "test"
            ? ".env.testing"
            : ".env"
}) */

export default {
    mongo_uri: process.env.URI_PASSWORD,
    port: process.env.PORT,
    mongo_db_name: process.env.MONGO_DB_NAME,
    key_jwt: process.env.SECRET_KEY_JWT,
    nodemailer_user: process.env.NODEMAILER_USER,
    nodemailer_password: process.env.NODEMAILER_PASSWORD
}