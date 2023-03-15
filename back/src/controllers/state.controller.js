import  * as State from "../models/State"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"

export const getStates = async (req, res) => {
    try {
        const states = await State.default.find()
        res.json(states)
    }catch(exception){
        return handleException(req, res, exception);
    }
}