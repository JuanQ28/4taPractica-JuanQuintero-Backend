import { productsManager } from "../dao/products.dao.js"

const getProductss = async (query) => {
    const result = productsManager.getProducts(query)
    return result
}

const getProducts = async (query) => {
    const {limit = 10, page = 1, sort, ...filter} = query
    const filterObj = {limit, page, lean: true,sort: sort && {price: (sort === "asc")
            ? 1
            : (sort === "desc") && -1}
        }
    const result = await productsManager.getProducts(filter, filterObj)
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
const addProducts = async (product) => { 
    const result = await productsManager.addProducts(product)
    return result
}
const getProductById = async (id) => {
    const result = await productsManager.getProductById(id)
    return result
}
const updateProduct = async (id, update) => {
    const result = await productsManager.updateProduct({_id: id}, update)
    return result
}
const deleteProduct = async(id) => {
    const result = await productsManager.deleteProduct({_id: id})
    return result
}

export {
    getProducts,
    addProducts,
    getProductById,
    updateProduct,
    deleteProduct
}