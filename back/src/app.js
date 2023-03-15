import express from "express"
import morgan from "morgan"
import bodyParser from "body-parser"
import pkg from "../package.json"

import {initSetup} from "./libs/initialSetup"

import privacyRoutes from "./routes/privacy.routes"
import stateRoutes from "./routes/state.routes"


import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import podcastRoutes from "./routes/podcast.routes"
import clipResponseRoutes from "./routes/clipResponse.routes"
import clipRequestRoutes from "./routes/clipRequest.routes"
import commentRoutes from "./routes/comment.routes"

import fileRoutes from "./routes/file.routes"


const app = express()
initSetup()

app.set("pkg", pkg)

app.use(morgan("dev"))
app.use(bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ 
  limit: '50mb',                                  // to support URL-encoded bodies
  extended: true
})); 

app.get("/", (req, res) => {
    res.json({
        name: app.get("pkg").name,
        author: app.get("pkg").author,
        description: app.get("pkg").description,
        version: app.get("pkg").version
    })
})


app.use("/api/privacy", privacyRoutes)
app.use("/api/state", stateRoutes)

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/podcast", podcastRoutes)
app.use("/api/file", fileRoutes)
app.use("/api/clip_response", clipResponseRoutes)
app.use("/api/clip_request", clipRequestRoutes)
app.use("/api/comment", commentRoutes)



export default app