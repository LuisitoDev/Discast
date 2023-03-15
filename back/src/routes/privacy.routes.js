import {Router} from "express"
const router = Router ()

import * as privacyController from "../controllers/privacy.controller"

router.get("/", privacyController.getPrivacies)

export default router