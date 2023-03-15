import {Router} from "express"
const router = Router ()

import * as authController from "../controllers/auth.controller"
import * as userController from "../controllers/user.controller"
import * as transactions from "../middlewares/transactions"

import {authJWT, validationModels} from "../middlewares/index"
const vAuth = validationModels.validateAuth

router.post("/signin", vAuth.signIn, authController.singIn)
router.post("/signup", 
            transactions.startSession,
            vAuth.signUp,
            authController.singUp,
            userController.createUser,
            transactions.endSession)

router.put("/", vAuth.updateChangePassword, [authJWT.verifyToken], authController.updatePassword)

export default router