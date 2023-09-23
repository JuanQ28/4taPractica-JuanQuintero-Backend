import {existsSync, promises} from "fs"
const path = 'src/products.json'


class ProductManager{
    constructor(path){
        this.path = path
    }
    async getProducts(queryObject){
        const {limit} = queryObject
        try {
            if(existsSync(this.path)){
                const products = await promises.readFile(this.path, 'utf-8')
                const productsData = JSON.parse(products)
                return limit ? productsData.slice(0, +limit) : productsData
            }else{
                return []
            }
        } catch (error) {
            return error
        }
    }
    async addProduct(product){
        try {
            const products = await this.getProducts({})
            let id
            if(!products.length){
                id = 1
            }else{
                id = products[products.length-1].id + 1 
            }
            const newProduct = {id, ...product}
            products.push(newProduct)
            await promises.writeFile(this.path, JSON.stringify(products))
            return newProduct
        } catch (error) {
            return error
        }
    }
    async getProductById(id){
        try {
            //En este área limpiamos lo que recibamos por params, esto para recibir un array con los números separados para que podemos hacer búsqueda de varios elementos también, estos separados por comas
            const idArray = id.replace(" ", "").split(",").map((numero) => +numero)
            const products = await this.getProducts({})
            let product
            let productNotFound = []
            let indexFound = []
            //En este caso podemos esperar un resultado o varios, dependiendo de la información que se nos suministren
            if(idArray.every((param) => !isNaN(param))){
                product = products.filter(product => idArray.includes(product.id))
                for (let elemento of product){
                    indexFound.push(elemento.id)
                }

                for (let numero of idArray){
                    if(!(indexFound.includes(numero))){
                        productNotFound.push(numero)
                    }
                }
            }else{
                return product = "some data are incorrect"
            }
            return [product, productNotFound]
        } catch (error) {
            return error
        }
    }
    async updateProduct(id, update){
        try {
            const products = await this.getProducts({})
            const index = products.findIndex(product => product.id == id)
            if (index === -1){
                return null
            }
            Object.assign(products[index], update)
            await promises.writeFile(this.path, JSON.stringify(products))
            return 'Modificación realizada con éxito'
        } catch (error) {
            return error
        }
    }
    async deleteProduct(id){
        try {
            const products = await this.getProducts({})
            const productFound = products.find(product => product.id === id)
            if(productFound){
                const newProducts = products.filter(product => product.id !== id)
                await promises.writeFile(this.path, JSON.stringify(newProducts))
            }
            return productFound
        } catch (error) {
            return error
        }
    }
}

//Exportamos la constante de la cual utilizaremos los método de peticiones en nuestro servidor
export const manager = new ProductManager(path)