import * as Privacy from "../models/Privacy"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"

export const getPrivacies = async (req, res) => {
    try {
        const privacies = await Privacy.default.find()
        res.json(privacies)
    }catch(exception){
        return handleException(req, res, exception);
    }
}