import UserAuthModel from "../models/Auth"
import * as message from "../libs/statusResponse"
import { generateEncryptedToken } from "../libs/tokenManager"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"

export const singUp = async (req, res, next) => {
    const { emailUserAuth, passwordUserAuth } = req.body
    try {
        const newUserAuthModel = new UserAuthModel({
            emailUserAuth,
            passwordUserAuth: await UserAuthModel.encryptPassword(passwordUserAuth)
        })
        const session =req.session
        const savedUserAuthModel = await newUserAuthModel.save({session})
    
        if (!savedUserAuthModel) return res.status(403).json({status: message.statusResponse.ERROR, message: "Error creating user"})
    
        req.authId = savedUserAuthModel._id
    
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const singIn = async (req, res) => {
    try {
        const userFound = await UserAuthModel.findOne({emailUserAuth: req.body.emailUserAuth})
        
        if(!userFound) return res.status(400).json({status: message.statusResponse.ERROR, message: "User not found"})
    
        const matchPassword = await UserAuthModel.comparePassword(req.body.passwordUserAuth, userFound.passwordUserAuth)
    
        if (!matchPassword) return res.status(400).json({status: message.statusResponse.ERROR, token: null, message: "Invalid password"})
    
        const token = generateEncryptedToken(userFound._id)

    
        res.json({status: message.statusResponse.SUCCESS, token: token})
    }catch(exception){
        return handleException(req, res, exception);
    }
}



export const updatePassword = async (req, res) => {
    const userAuthId  = req.userAuthId
    const { lastPassword,  newPassword } = req.body

    try {
        const userFound = await UserAuthModel.findById(userAuthId)
        
        const matchPassword = await UserAuthModel.comparePassword(lastPassword, userFound.passwordUserAuth)
    
        if (!matchPassword) return res.status(400).json({status: message.statusResponse.ERROR, message: "Invalid password"})
    
        const updatedUser = await User.findByIdAndUpdate(userAuthId, { passwordUserAuth : newPassword })
        
        res.status(200).json(updatedUser)
    }catch(exception){
        return handleException(req, res, exception);
    }


}
