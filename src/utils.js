import {dirname} from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const __dirname = dirname(fileURLToPath(import.meta.url))

const SecretKey = "Proyecto47315"

export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
}

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData)
}

export const generateToken = (user) => {
    const token = jwt.sign(user, SecretKey, {expiresIn: 1000})
    return token
}

export const removeEmpty = (obj) => {
    return Object.entries(obj)
        .filter(([_, v]) => v != "")
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}