import {Router} from "express"
const router = Router ()

import { authJWT,upload, validationModels } from "../middlewares/index"
const vUser = validationModels.validateUser

import * as userController from "../controllers/user.controller"
import * as fileController from "../controllers/file.controller"
import * as transactions from "../middlewares/transactions"


router.get("/:userId", vUser.getUser, userController.getUserById)
router.get("/search/profile", [authJWT.verifyToken], userController.getUserInfoProfile)
router.get("/search/stats", [authJWT.verifyToken], userController.getStatsUser) //TODO: Felix
router.get("/search/favorite_user", [authJWT.verifyToken], userController.getFavoriteUser) //TODO: Felix

router.put("/followers", [authJWT.verifyToken, vUser.updateUserFollows], userController.updateUserAddFollowers)
// router.put("/following", vUser.updateUserFollows, [authJWT.verifyToken], userController.updateUserAddFollowing) //TODO: DEPRECATED

const uploadFilesUpdate = upload.fields([{ name: 'imageFileUser', maxCount: 1 }])
router.put( "/update_image",
            transactions.startSession,
            authJWT.verifyToken,
            uploadFilesUpdate, 
            vUser.updateUserImage, 
            [userController.getImageUserById, fileController.deleteFileById], 
            userController.updateImageUserById,
            transactions.endSession)
            
router.put("/send_friend_requests", [authJWT.verifyToken, vUser.updateUserFriendRequests], userController.updateUserAddFriendRequest) //TODO: Felix
router.put("/add_friend", [authJWT.verifyToken, vUser.updateUserFriends], userController.updateUserAddFriend) //TODO: Felix REVISAR "vUser.updateUserFriends"
router.put("/decline_friend_request", [authJWT.verifyToken, vUser.updateUserFriends], userController.updateUserDeclineFriend) //TODO: Felix REVISAR "vUser.updateUserFriends"

router.put("/", [authJWT.verifyToken, vUser.updateUser], userController.updateUserById)

            

export default router