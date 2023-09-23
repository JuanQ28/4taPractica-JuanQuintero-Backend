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
            products.push({id, ...product})
            await promises.writeFile(this.path, JSON.stringify(products))
        } catch (error) {
            return error
        }
    }
    async getProductById(id){
        try {
            const products = await this.getProducts({})
            const product = products.find(product => product.id == id)
            return product
        } catch (error) {
            return error
        }
    }
    async updateProduct(id, update){
        try {
            const products = await this.getProducts({})
            const index = products.findIndex(product => product.id == id)
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
            const newProducts = products.filter(product => product.id !== id)
            await promises.writeFile(this.path, JSON.stringify(newProducts))
            return 'Producto eliminado con éxito'
        } catch (error) {
            return error
        }
    }
}

//Exportamos la constante de la cual utilizaremos los método de peticiones en nuestro servidor
export const manager = new ProductManager(path)