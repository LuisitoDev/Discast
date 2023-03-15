import {Router} from "express"
const router = Router ()

import { authJWT } from "../middlewares/index"
import * as fileController from "../controllers/file.controller"

router.get("/:id", fileController.getFileById)
router.get("/data/:id", fileController.getFileDataById)

export default router