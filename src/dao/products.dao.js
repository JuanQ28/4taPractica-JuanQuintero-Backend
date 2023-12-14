import { productsModel } from "../models/products.model.js";

class ProductsManager {
    async getProducts(filter, filterObj){
        const result = await productsModel.paginate(filter, filterObj)
        return result
    }
    async addProducts(product){
        const result = await productsModel.create(product)
        return result
    }
    async getProductById(id){
        const result = await productsModel.findById(id)
        return result
    }
    async updateProduct(id, update){
        const result = await productsModel.updateOne({_id: id}, update)
        return result
    }
    async deleteProduct(id){
        const result = await productsModel.findOneAndDelete({_id: id})
        return result
    }
}

export const productsManager = new ProductsManager()