import {validationResult, matchedData} from 'express-validator'
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

export const messagesFields = {
    notSendedField : 'This field was not sended',
    emptyField : 'This field is empty',
    fieldMustBeNumeric : 'This field must be numeric',
    fieldGreaterThanZero : 'The field must be greater than zero',
    mustBeNumericAndPositive : 'This field must be numeric and must be greater than zero',
    invalidEmail : 'Invalid email address'
}

let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", function () {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

export const deleteFiles = async (req) => {
    for(let prop in req.files){
        try {
            console.log(`Deleting ${prop} file with id `, req.files[prop][0].id);
            await gfs.files.deleteOne({
                _id: mongoose.Types.ObjectId(req.files[prop][0].id)
            });
        }catch(exception) {
            console.log(error);
            writeLog(error);
        }
    }
}


export const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        deleteFiles(req);
        console.log(errors);
        return res.status(422).jsonp(errors.array());
    }

    const bodyData = matchedData(req, {locations:['body'], includeOptionals:true});

    req.body = bodyData;

    next();
}