import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { productManager } from "./manager/ProductManager.js";

//Creamos nuestro servidor desde express
const app = express()
//Ahora le permitimos a nuestro servidor recibir información desde el body
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
//Ahora le decimos le asignamos el puerto 8080 a nuestro servidor
const httpServer = app.listen(8080, () => console.log("Server running in port:8080"))

//Asignamos como publica, nuestra carpeta public


//Handlebars
app.engine("handlebars", engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//En esta sección le diremos a nuestro servidor los routers a implementar para ciertas rutas que se le sean solicitadas

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

//Ahora configuramos nuestro sockect
const socketServer = new Server(httpServer)

////////////////////////////
//EVENTOS///////////////////
////////////////////////////

socketServer.on("connection", (socket) => {
    socket.on("addProduct", async (title, description, code, price, stock, category, thumbnail) =>{
        socketServer.emit("newProducts", title, description, code, price, stock, category, thumbnail)
    })
    socket.on("deleteProduct", async (code) =>{
        socketServer.emit("deleteCard", code)
    })
})

