import { getDecryptedToken } from "../libs/tokenManager"
import AuthUserModel from "../models/Auth"
import UserModel from "../models/User"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        
        if (!token) 
            throw new ExceptionHandler("No token provided")
        
        const decoded = getDecryptedToken(token) 
        req.userAuthId = decoded.id

        const authUser = await AuthUserModel.findById(req.userAuthId, {passwordUserAuth: 0})

        if (!authUser)
            throw new ExceptionHandler("No user found", 404)

        const userFound = await UserModel.findOne({emailUser: req.userAuthId})
        req.userId = userFound._id

        next() 
    } catch (exception) {
        return handleException(req, res, exception);
    }

}