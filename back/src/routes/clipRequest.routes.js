import {Router} from "express"
const router = Router ()

import * as clipRequestController from "../controllers/clipRequest.controller"
import {authJWT, validationModels} from "../middlewares/index"
const vClipRequest= validationModels.validateClipRequest

router.get( "/:clipRequestId", 
            vClipRequest.getClipRequestById, 
            clipRequestController.getClipRequestById)

router.get( "/podcast/:podcastId/page/:page", 
            vClipRequest.getClipRequestByPodcastPage, 
            clipRequestController.getClipRequestByPodcast)


router.put( "/:clipRequestId", 
            [authJWT.verifyToken, vClipRequest.updateClipRequest], 
            clipRequestController.updateClipRequestById)

router.put( "/votes_clip_request/:clipRequestId", 
            [authJWT.verifyToken, vClipRequest.updateVotesToClipRequest], 
            clipRequestController.updateVotesToClipRequest)


router.delete("/:clipRequestId", 
            [authJWT.verifyToken, vClipRequest.deleteClipRequestById], 
            clipRequestController.deleteClipRequestById)

            
router.delete("/podcast/:podcastId/clip_request/:clipRequestId", 
            [authJWT.verifyToken, vClipRequest.deleteClipRequestByPodcastAndId], 
            clipRequestController.deleteClipRequestByPodcastAndId)

export default router