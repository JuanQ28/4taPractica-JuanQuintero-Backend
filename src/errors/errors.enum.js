export const errors = {
    PRODUCT_NOT_FOUND: {
        name: "PRODUCT_NOT_FOUND",
        code: 404,
        message: "Product not found by id"
    },
    CART_NOT_FOUND: {
        name: "CART_NOT_FOUND",
        code: 404,
        message: "Cart not found by id" 
    },
    USER_NOT_FOUND: {
        name: "USER_NOT_FOUND",
        code: 404,
        message: "User not found"
    },
    USER_ALREADY_EXISTS: {
        name: "USER_ALREADY_EXISTS",
        code: 409,
        message: "User already exists"
    },
    INVALID_CREDENTIALS: {
        name: "INVALID_CREDENTIALS",
        code: 401,
        message:  "invalid credentials" 
    }
}