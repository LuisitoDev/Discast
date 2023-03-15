import {Router} from "express"
const router = Router ()

import * as podcastController from "../controllers/podcast.controller"
import * as clipResponseController from "../controllers/clipResponse.controller"
import * as clipRequestController from "../controllers/clipRequest.controller"
import * as commentController from "../controllers/comment.controller"
import * as fileController from "../controllers/file.controller"
import * as transactions from "../middlewares/transactions"
import {authJWT, upload, validationModels} from "../middlewares/index"
const vPodcast = validationModels.validatePodcast

router.get( "/:podcastId",
            vPodcast.getPodcast, 
            podcastController.getPodcastById)

router.get( "/discover/:page", 
            vPodcast.getPodcastByPage, 
            podcastController.getRecentPodcast) 

router.get( "/top/:page", 
            vPodcast.getPodcastByPage, 
            podcastController.getTopLikedPodcast) 

router.get( "/followed/:page", 
            [authJWT.verifyToken, vPodcast.getPodcastByPage], 
            podcastController.getFollowingPodcast) 

router.get( "/created/:page", 
            [authJWT.verifyToken, vPodcast.getPodcastByPage], 
            podcastController.getPodcastCreated) //TODO: FELIX



//TODO: Search endpoint with specific parameters


const uploadFilesCreate = upload.fields([{ name: 'imageFilePodcast', maxCount: 1 }, { name: 'soundFileClipResponse', maxCount: 1 }])
router.post("/",
            transactions.startSession,
            authJWT.verifyToken,
            uploadFilesCreate, 
            vPodcast.createPodcast, 
            clipResponseController.createClipResponse, 
            podcastController.createPodcast,
            transactions.endSession)


router.put( "/:podcastId",
            [authJWT.verifyToken, vPodcast.updatePodcast], 
            podcastController.updatePodcastById)

router.post( "/revisar_alarms_one",
            podcastController.imprimirAlarmsOne)

const uploadFilesUpdate = upload.fields([{ name: 'imageFilePodcast', maxCount: 1 }])
router.put( "/update_image/:podcastId",
            transactions.startSession,
            authJWT.verifyToken, 
            uploadFilesUpdate, 
            vPodcast.updateImagePodcast, 
            [podcastController.getImagePodcastById, fileController.deleteFileById], 
            podcastController.updateImagePodcastById,
            transactions.endSession)


router.put( "/update_state/:podcastId",
            [authJWT.verifyToken, vPodcast.updateStatePodcast], 
            podcastController.updateStatePodcastById)


const uploadFilesAddClipResponse = upload.fields([{ name: 'soundFileClipResponse', maxCount: 1 }])
router.put( "/add_clip_response/:podcastId",
            transactions.startSession,
            authJWT.verifyToken,
            uploadFilesAddClipResponse, 
            vPodcast.updatePodcastAddClipResponse, 
            clipResponseController.createClipResponse, 
            podcastController.updatePodcastAddClipResponse,
            transactions.endSession)

router.put("/clip_request_to_response/:podcastId",
            [authJWT.verifyToken, vPodcast.updatePodcastClipRequestToResponse],
            podcastController.updatePodcastClipRequestToResponse)

const uploadFilesAddClipRequest = upload.fields([{ name: 'soundFileClipRequest', maxCount: 1 }])
router.put( "/add_clip_request/:podcastId",
            transactions.startSession,
            authJWT.verifyToken, 
            uploadFilesAddClipRequest, 
            vPodcast.updatePodcastAddClipRequest, 
            clipRequestController.createClipRequest, 
            podcastController.updatePodcastAddClipRequest,
            transactions.endSession)

router.put( "/add_comment/:podcastId", 
            transactions.startSession,
            [authJWT.verifyToken, vPodcast.updatePodcastAddComment], 
            commentController.createComment, 
            podcastController.updatePodcastAddComment,
            transactions.endSession)

router.put( "/likes_podcast/:podcastId",
            [authJWT.verifyToken, vPodcast.updateLikesToPodcast], 
            podcastController.updateLikesToPodcast)


router.put("/views_podcast/:podcastId",
            podcastController.updateViewsToPodcast)

router.delete("/:podcastId",
            [authJWT.verifyToken, vPodcast.deletePodcast], 
            podcastController.deletePodcastById)

export default router