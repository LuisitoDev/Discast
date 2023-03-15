import mongoose from "mongoose"
import {writeLog} from "./libs/log";
require("dotenv").config()

mongoose.connect(process.env.MONGODB_URI, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => {console.log("Db is connected"); writeLog('Db is connected')})
    .catch(error => {console.log(error); writeLog(error)})