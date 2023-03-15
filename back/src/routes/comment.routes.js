import {Router} from "express"
import { validationResult } from "express-validator"
const router = Router ()

import * as commentController from "../controllers/comment.controller"
import {authJWT, validationModels} from "../middlewares/index"
const vComment= validationModels.validateComments

router.get( "/:commentId",
            vComment.getComment, 
            commentController.getCommentById)

router.get( "/podcast/:podcastId/page/:page",
            vComment.getCommentsByPodcastPage, 
            commentController.getCommentsByPodcast)


router.put( "/:commentId",
            [authJWT.verifyToken, vComment.updateComment], 
            commentController.updateCommentById)

            
router.delete("/:commentId", 
            [authJWT.verifyToken, vComment.deleteComment], 
            commentController.deleteCommentById)

export default router