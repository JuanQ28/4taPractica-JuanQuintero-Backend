import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import productsRouterMongo from "./routes/products.router.mongo.js"
import cartsRouterMongo from "./routes/carts.router.mongo.js"
import { messagesManager } from "./dao/manager-mongo/MessagesManager.mongo.js";

//Agregamos nuestro archivo de configuraciones para el acceso a nuestra base de datos MongoDB
import "./dao/config.js"

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

//En esta sección le diremos a nuestro servidor los routers a implementar para ciertas rutas que se le sean solicitadas, dejamos clara la separación entra FileSystem y el manejo con MongoDB

app.use('/api/fs/products', productsRouter)
app.use('/api/fs/carts', cartsRouter)
app.use('/', viewsRouter)

//Estas rutas de a continuación son las que nos servirán para mongo

app.use("/api/mongo/products", productsRouterMongo)
app.use("/api/mongo/carts", cartsRouterMongo)

//Ahora configuramos nuestro sockect
const socketServer = new Server(httpServer)

/////////////////////////////////////////////////////////////////
//EVENTOS para trabajo con productos en tiempo real, FileSystem//
/////////////////////////////////////////////////////////////////

socketServer.on("connection", (socket) => {
    socket.on("addProduct", async (title, description, code, price, stock, category, thumbnail) =>{
        socketServer.emit("newProducts", title, description, code, price, stock, category, thumbnail)
    })
    socket.on("deleteProduct", async (code) =>{
        socketServer.emit("deleteCard", code)
    })
    //Estos eventos serán los del chat:
    socket.on("newUser", async (email) =>{
        socket.broadcast.emit("userConnected", email)
    })
    socket.on("message", async (message) => {
        const newMessage = await messagesManager.addMessage(message)
        const allMessages = await messagesManager.getMessages()
        socketServer.emit("chat", allMessages)
    })
})

