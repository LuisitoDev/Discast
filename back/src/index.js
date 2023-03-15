import app from "./app"
import {writeLog} from "./libs/log";
import "./database"

require("dotenv").config()

app.listen(process.env.CUSTOMIZE_PORT)
writeLog(`Server listenning on port ${process.env.CUSTOMIZE_PORT}`);
console.log("Puerto escuchado", process.env.CUSTOMIZE_PORT)