import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "../tools.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Proyecto-JuanQuintero",
            version: "1.0.0",
            description: "API documentation for Proyecto-JuanQuinteto"
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

export const swaggerSetup = swaggerJSDoc(swaggerOptions)