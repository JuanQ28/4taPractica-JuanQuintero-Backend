import express from "express";
import productsRouterFile from "./file/routes-file/products.file.router.js";
import cartsRouterFile from "./file/routes-file/carts.file.router.js";
import viewsRouter from "./routes/views.router.js";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import { messagesManager } from "./dao/messages.dao.js";
import usersRouter from "./routes/users.router.js";
import MongoStore from "connect-mongo";
import "./passport.js"
import passport from "passport";
import config from "./config/config.js";

//Agregamos nuestro archivo de configuraciones para el acceso a nuestra base de datos MongoDB
import "./config/db.connection.js"
import cookieParser from "cookie-parser";
import session from "express-session";
const URI = `mongodb+srv://elquinteje:${process.env.URI_PASSWORD}@cluster0.fy8hs8n.mongodb.net/ecommerce?retryWrites=true&w=majority`

//Creamos nuestro servidor desde express
const app = express()
//Ahora le permitimos a nuestro servidor recibir información desde el body
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(cookieParser("SecretCookie"))
app.use(session({store: new MongoStore({mongoUrl: URI}),secret: "secretPassword", cookie: {maxAge: 1200000}}))
//Ahora le decimos le asignamos el puerto 8080 a nuestro servidor
const httpServer = app.listen(config.port, () => console.log(`Server running in port:${config.port}`))

//passport
app.use(passport.initialize())
app.use(passport.session())

//Handlebars
app.engine("handlebars", engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

//En esta sección le diremos a nuestro servidor los routers a implementar para ciertas rutas que se le sean solicitadas, dejamos clara la separación entra FileSystem y el manejo con MongoDB

app.use('/api/fs/products', productsRouterFile)
app.use('/api/fs/carts', cartsRouterFile)
app.use('/', viewsRouter)

//Estas rutas de a continuación son las que nos servirán para mongo

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/users", usersRouter)

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

