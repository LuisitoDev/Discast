import {Router} from "express"
const router = Router ()

import * as stateController from "../controllers/state.controller"

router.get("/", stateController.getStates)

export default router