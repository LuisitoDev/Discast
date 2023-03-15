import { writeLog } from "../libs/log"
import { deleteFiles } from "../middlewares/validationModels/validationHandler"
import * as message from "../libs/statusResponse"

class ExceptionHandler{

    message;
    codeError;

    constructor (message, codeError = 403){
        this.message = message;
        this.codeError = codeError;
    }

    getMessage(){
        return this.message;
    }

    getCodeError(){
        return this.codeError;
    }
    
}

const handleException = async (req, res, exception) => {
    let messageError;
    let codeError = 403;
    if (exception instanceof ExceptionHandler) {
        messageError = exception.getMessage();
        codeError = exception.getCodeError();
    } else {
        writeLog(exception);
        messageError = "An error has ocurred";
    }

    if(req.uploadedFile === true){
        // deleteFiles(req);   
    }
    if(req.session){
        await req.session.abortTransaction();
    }

    return res.status(codeError).json({status: message.statusResponse.ERROR, message:messageError})
}

export { ExceptionHandler, handleException };

