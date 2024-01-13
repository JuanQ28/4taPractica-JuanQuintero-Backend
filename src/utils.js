import {dirname} from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const hashData = async (data) => {
    return bcrypt.hash(data, 10)
}

export const compareData = async (data, hashedData) => {
    return bcrypt.compare(data, hashedData)
}

export const generateToken = (user) => {
    const token = jwt.sign(user, config.key_jwt, {expiresIn: 1000})
    return token
}

export const removeEmpty = (obj) => {
    return Object.entries(obj)
        .filter(([_, v]) => v != "")
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
}