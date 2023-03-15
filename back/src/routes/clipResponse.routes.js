import {Router} from "express"
const router = Router ()

import * as clipResponseController from "../controllers/clipResponse.controller"
import {authJWT, validationModels} from "../middlewares/index"
const vClipResponse= validationModels.validateClipResponse

router.get( "/:clipResponseId", 
            vClipResponse.getClipResponse, 
            clipResponseController.getClipResponseById)

router.get( "/podcast/:podcastId/page/:page",
            vClipResponse.getClipResponseByPodcastPage, 
            clipResponseController.getClipResponseByPodcast)


router.put( "/likes_clip_response/:clipResponseId", 
            [authJWT.verifyToken, vClipResponse.updateLikesToClipResponse], 
            clipResponseController.updateLikesToClipResponse)

            
router.delete("/:clipResponseId",
            [authJWT.verifyToken, vClipResponse.deleteClipResponse],
            clipResponseController.deleteClipResponseById)


export default router