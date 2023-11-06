import { productsModel } from "../models/products.model.js";

class ProductsManager {
    async getProducts(query){
        const {limit = 10, page = 1, sort,...filter} = query
        const result = await productsModel.paginate(filter, {limit, page, lean: true,sort: sort && {price: (sort === "asc")
                ? 1
                : (sort === "desc") && -1}
            })
        const info = {
            status: (result.docs.length === 0)
                ? "error"
                : "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            limit: result.limit,
            totalDocs: result.totalDocs,
            prevLink: (!result.hasPrevPage) 
                ? null
                : (!query.limit)
                    ? `http://localhost:8080/api/mongo/products?page=${result.prevPage}`
                    : `http://localhost:8080/api/mongo/products?page=${result.prevPage}&&limit=${query.limit}`,
            nextLink: (!result.hasNextPage) 
                ? null
                : (!query.limit)
                    ? `http://localhost:8080/api/mongo/products?page=${result.nextPage}`
                    : `http://localhost:8080/api/mongo/products?page=${result.nextPage}&&limit=${query.limit}`,
        }
        return info
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