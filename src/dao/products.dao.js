import { productsModel } from "../models/products.model.js";
import { logger } from "../utils/logger.js";

class ProductsManager {
    async getProducts(filter, filterObj){
        const result = await productsModel.paginate(filter, filterObj)
        logger.http("Products received correctly")
        return result
    }
    async addProducts(product){
        const result = await productsModel.create(product)
        logger.http("Product added correctly")
        return result
    }
    async getProductById(id){
        const result = await productsModel.findById(id)
        logger.http("Product by id received correctly")
        return result
    }
    async updateProduct(id, update){
        const result = await productsModel.updateOne({_id: id}, update)
        logger.http("Product updated correctly")
        return result
    }
    async deleteProduct(id){
        const result = await productsModel.findOneAndDelete({_id: id})
        logger.http("Product deleted correctly")
        return result
    }
}

export const productsManager = new ProductsManager()