import jwt from "jsonwebtoken"
require("dotenv").config()

export const generateEncryptedToken = (idParam) => {
    return jwt.sign({ id: idParam }, process.env.SECRET, { expiresIn: process.env.EXPIRE_TOKEN_TIME })
}

export const getDecryptedToken = (token) => {
    return jwt.verify(token, process.env.SECRET)
}