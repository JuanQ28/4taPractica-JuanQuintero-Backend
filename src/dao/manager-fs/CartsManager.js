import {existsSync, promises} from "fs"
const path = 'src/data/carts.json'
const pathProducts = 'src/data/products.json'

class CartManager{
    constructor(path, pathProducts){
        this.path = path
        this.pathProducts = pathProducts
    }
    async getCarts(){
        try {
            if(existsSync(this.path)){
                const carts = await promises.readFile(this.path, 'utf-8')
                const cartsData = JSON.parse(carts)
                return cartsData
            }else{
                return []
            }
        } catch (error) {
            return error
        }
    }
    async addCart(){
        try {
            const carts = await this.getCarts()
            let id
            if(!carts.length){
                id = 1
            }else{
                id = carts[carts.length-1].id + 1 
            }
            const newCart = {id, products: []}
            carts.push(newCart)
            await promises.writeFile(this.path, JSON.stringify(carts))
            return newCart
        } catch (error) {
            return error
        }
    }
    async addCartProduct(cartId, productId){
        try {
            //Acá inicializamos las variables que retornaremos como información para la respuestfa del servidor
            let cartRes = "good"
            let productRes = "good"
            let cardProductIndexRes 
            //Primero capturaremos el array de productos y el array de carritos
            const products = await promises.readFile(this.pathProducts, 'utf-8')
            const productsData = JSON.parse(products)
            const productIndex = productsData.findIndex(product => product.id == productId)
            const cartsData = await this.getCarts()
            const cartIndex = cartsData.findIndex(cart => cart.id == cartId)
            //Ahora confirmameros que tanto el carrito suministrado y el producto suministrado existan
            if(cartIndex == -1){
                cartRes = null
            }else if(productIndex == -1){
                productRes = null
            }
            //Procedemos a validar las posiciones y agregar las cantidades de 1 en 1, y si el producto no existe en el carrito, agregarlo de 0, con su cantidad en 1
            if(cartIndex != -1 && productIndex != -1){
                const cardProductIndex = cartsData[cartIndex].products.findIndex(product => product.id == productsData[productIndex].id) 
                if(cardProductIndex != -1){
                    cartsData[cartIndex].products[cardProductIndex].quantity++
                }else{
                    cartsData[cartIndex].products.push({id: productsData[productIndex].id, quantity: 1})
                }
                //En este área mostraremos los resultados obtenidos, y de paso agregamos el índice nuevo, en caso de que el producto no estuviese en el carrito
                cardProductIndexRes = cartsData[cartIndex].products.findIndex(product => product.id == productsData[productIndex].id) 
                cartRes = cartsData[cartIndex]
                await promises.writeFile(this.path, JSON.stringify(cartsData))
            }
            return [cartRes, productRes, cardProductIndexRes]
        } catch (error) {
            return error
        }
    }
    async getCardById(id){
        try {
            //En este área limpiamos lo que recibamos por params, esto para recibir un array con los números separados para que podemos hacer búsqueda de varios elementos también, estos separados por comas
            const idArray = id.replace(" ", "").split(",").map((numero) => +numero)
            const carts = await this.getCarts()
            let cart
            let cartNotFound = []
            let indexFound = []
            //En este caso podemos esperar un resultado o varios, dependiendo de la información que se nos suministren
            if(idArray.every((param) => !isNaN(param))){
                cart = carts.filter(cart => idArray.includes(cart.id))
                for (let elemento of cart){
                    indexFound.push(elemento.id)
                }
                for (let numero of idArray){
                    if(!(indexFound.includes(numero))){
                        cartNotFound.push(numero)
                    }
                }
            }else{
                return cart = "some data are incorrect"
            }
            return [cart, cartNotFound]
        } catch (error) {
            return error
        }
    }
}

export const cartsManager = new CartManager(path, pathProducts)