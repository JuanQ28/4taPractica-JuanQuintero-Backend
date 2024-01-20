import { productsManager } from "../dao/products.dao.js"
import CustomError from "../errors/error.generator.js"
import { errors } from "../errors/errors.enum.js"

class productsRepository{
    constructor(dao){
        this.dao = dao
    }
    getProducts = async (query, role = "CLIENT") => {
        const {limit = 10, page = 1, sort, ...filter} = query
        const filterObj = {limit, page, lean: true,sort: sort && {price: (sort === "asc")
                ? 1
                : (sort === "desc") && -1}
            }
        const result = await productsManager.getProducts(filter, filterObj)
        let info
        if(role === "ADMIN"){
            info = {
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
                        ? `http://localhost:8080/admin/products?page=${result.prevPage}`
                        : `http://localhost:8080/admin/products?page=${result.prevPage}&&limit=${query.limit}`,
                nextLink: (!result.hasNextPage) 
                    ? null
                    : (!query.limit)
                        ? `http://localhost:8080/admin/products?page=${result.nextPage}`
                        : `http://localhost:8080/admin/products?page=${result.nextPage}&&limit=${query.limit}`,
            }
        }else if(role === "CLIENT"){
            info = {
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
                        ? `http://localhost:8080?page=${result.prevPage}`
                        : `http://localhost:8080?page=${result.prevPage}&&limit=${query.limit}`,
                nextLink: (!result.hasNextPage) 
                    ? null
                    : (!query.limit)
                        ? `http://localhost:8080?page=${result.nextPage}`
                        : `http://localhost:8080?page=${result.nextPage}&&limit=${query.limit}`,
            }
        }
        return info
    }
    addProducts = async (product) => { 
        const result = await productsManager.addProducts(product)
        return result
    }
    getProductById = async (id) => {
        const result = await productsManager.getProductById(id)
        if(!result){
            return CustomError.generateError(errors.PRODUCT_NOT_FOUND.message, errors.PRODUCT_NOT_FOUND.code, errors.PRODUCT_NOT_FOUND.name)
        }
        return result
    }
    updateProduct = async (id, update) => {
        const result = await productsManager.updateProduct({_id: id}, update)
        return result
    }
    deleteProduct = async(id) => {
        const result = await productsManager.deleteProduct({_id: id})
        return result
    }
}

export const productsServices = new productsRepository(productsManager)