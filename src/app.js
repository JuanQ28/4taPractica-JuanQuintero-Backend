import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";



//Creamos nuestro servidor desde express
const app = express()
//Ahora le permitimos a nuestro servidor recibir información desde el body
app.use(express.json())
//Ahora le decimos le asignamos el puerto 8080 a nuestro servidor
app.listen(8080, () => console.log("Server running in port:8080"))



//En esta sección le diremos a nuestro servidor los routers a implementar para ciertas rutas que se le sean solicitadas

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

