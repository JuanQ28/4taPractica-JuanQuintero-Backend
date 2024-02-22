//import "../src/config/db.connection.js"
import supertest from "supertest"
import { Arg } from "../src/config/commander.js"
import { after, describe, it } from "mocha"
import mongoose from "mongoose"
import { productsServices } from "../src/services/products.services.js"
import { expect } from "chai"
import config from "../src/config/config.js"

const requester = supertest(`http://localhost:8080`)
const URI = `mongodb+srv://elquinteje:${config.mongo_uri}@cluster0.fy8hs8n.mongodb.net/${config.mongo_db_name}?retryWrites=true&w=majority`

describe("Products endpoints", () => {
    const productMock = {
        title: "Proteína Master",
        category: "proteina",
        price: 220000,
        stock: 22,
        thumbnail: "https://http2.mlstatic.com/D_NQ_NP_964311-MCO49951989673_052022-O.jpg",
        description: "13Lb",
        email: "prueba@test.com"
    }
    const productUpdates = {
        title: "Creatina Master",
        category: "creatina"
    }
    const queryParams = {
        limit: 5,
        page: 2
    }
    describe("GET /api/products", () => {
        it("Should return an array in payload", async () => {
            const products = await requester.get("/api/products/")
            expect(products._body.result.payload).to.be.an("array")
        })
        it("Should return the same query params", async () => {
            const products = await requester.get("/api/products/").query(queryParams)
            expect(products._body.result.page).to.be.equal(queryParams.page)
            expect(products._body.result.limit).to.be.equal(queryParams.limit)
        })
    })
    describe("POST /api/products", () => {
        before(async function () {
            this.timeout(10000)
            await mongoose.connect(URI)
            await mongoose.connection.collection("products").deleteOne({title: productMock.title})
        })
        it("Should create a product", async () => {
            const newProduct = await requester.post("/api/products/").send(productMock)
            //console.log(newProduct.test)
            const productsPages = await productsServices.getProducts({})
            const products = await productsServices.getProducts({page: productsPages.totalPages})
            expect(products.payload[products.payload.length -1].title).to.be.equal(productMock.title)
        })
    })
    describe("GET /api/products/:pid", async () => {
        it("Should get a product by id", async () => {
            //const newProduct = await requester.post("/api/products/").send(productMock)
            const productsPages = await productsServices.getProducts({})
            const products = await productsServices.getProducts({page: productsPages.totalPages})
            const productById = await requester.get(`/api/products/${products.payload[products.payload.length -1]._id}`)
            expect(productById._body.products._id).to.be.equal(products.payload[products.payload.length -1]._id.toString())
        })
    })
    describe("POST /api/products/updateProduct/:pid", () => {
        it("Should modify a product correctly", async () => {
            const productsPages = await productsServices.getProducts({})
            const products = await productsServices.getProducts({page: productsPages.totalPages})
            const updateProduct = await requester.post(`/api/products/updateProduct/${products.payload[products.payload.length -1]._id}`).send(productUpdates)
            const productsAfterUpdate = await productsServices.getProducts({page: productsPages.totalPages})
            //console.log(updateProduct)
            expect(productsAfterUpdate.payload[products.payload.length -1].title).to.be.equal(productUpdates.title)
            expect(productsAfterUpdate.payload[products.payload.length -1].category).to.be.equal(productUpdates.category)
        })
    })
    describe("POST /api/products/deleteProduct/:pid", () => {
        it("Should delete a product by id", async () => {
            const productsPages = await productsServices.getProducts({})
            const products = await productsServices.getProducts({page: productsPages.totalPages})
            const deleteProduct = await requester.post(`/api/products/deleteProduct/${products.payload[products.payload.length -1]._id}`)
            //console.log(deleteProduct)
            const productById = await requester.get(`/api/products/${products.payload[products.payload.length -1]._id}`)
            //console.log(productById)
            expect(productById._body.message).to.be.equal('Product not found by id')
        })
        after(async function () {
            this.timeout(10000)
            await mongoose.connect(URI)
            await mongoose.connection.collection("products").deleteOne({title: productUpdates.title})
        })
    })
})