import mongoose from "mongoose";
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"

const conn = mongoose.connection;


export const startSession = async (req,res,next) => {
    const session = await conn.startSession();
    try {
        session.startTransaction();
        req.session = session;
        next();
    }catch(exception){
        session.endSession()
        return handleException(req, res, exception)
    }

}

export const endSession = async (req,res,next) => {
    try {
        await req.session.commitTransaction();
    }catch(exception) {
        await req.session.abortTransaction();
        return handleException(req, res, exception)
    }
    
    req.session.endSession();
    next();
}   
