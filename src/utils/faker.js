import { faker } from "@faker-js/faker";

export const generateProduct = () => {
    const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.product(),
        description: faker.number.int({ min: 1, max: 5 }) + "lb",
        code: faker.number.int(),
        price: faker.number.int({ min: 50000, max: 350000 }),
        status: true,
        stock: faker.number.int({ max: 100 }),
        category: faker.string.fromCharacters(['proteina', 'creatina']),
        thumbnail: "/assets/imageNotFound.png"
    }
    return product
}