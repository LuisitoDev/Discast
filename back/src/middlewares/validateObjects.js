import * as Auth from "../models/Auth"
import * as User from "../models/User"
import * as Podcast from "../models/Podcast"
import * as Privacy from "../models/Privacy"
import * as State from "../models/State"
import * as ClipResponse from "../models/ClipResponse"
import * as ClipRequest from "../models/ClipRequest"
import * as Comment from "..//models/Comment"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"
const ObjectId = require('mongoose').Types.ObjectId;  

const validateObjectId = (id, nameParam) => {

    if (!ObjectId.isValid(id)) {     
        throw new ExceptionHandler(`${nameParam} is not a valid Id`)
    } else {      
        if (String(new ObjectId(id)) !== id) 
            throw new ExceptionHandler(`${nameParam} is not a valid Id`)
    }

}


export const isAuthorPodcast = async (req, res, next) => {
    try {
        const podcast = await Podcast.default.findOne({_id: req.params.podcastId})

        if (!podcast.authorPodcast.equals(req.userId)) 
            throw new ExceptionHandler("User is not Author of Podcast")

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const isAuthorClipResponse = async (req, res, next) => {
    try {
        const clipResponse = await ClipResponse.default.findOne({_id: req.params.clipResponseId})

        if (!clipResponse) 
            throw new ExceptionHandler("Clip Response not exists")

        if (!clipResponse.userClipResponse.equals(req.userId)) 
            throw new ExceptionHandler("User is not Author of ClipResponse")

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const isAuthorClipRequest = async (req, res, next) => {
    try {
        const clipRequest = await ClipRequest.default.findOne({_id: req.params.clipRequestId})
        if (!clipRequest) 
            throw new ExceptionHandler("Clip Request not exists")

        if (!clipRequest.userClipRequest.equals(req.userId)) 
            throw new ExceptionHandler("User is not Author of ClipRequest")
        
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const isAuthorComment = async (req, res, next) => {
    try {
        console.log(req.params.commentId)
        const comment = await Comment.default.findOne({_id: req.params.commentId})
        console.log(comment)
        if (!comment) 
            throw new ExceptionHandler("Comment not exists")

        if (!comment.userComment.equals(req.userId)) 
            throw new ExceptionHandler("User is not Author of Comment")

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const validateDuplicateEmail = async (req, res, next) => {
    try {
        const email = req.body.emailUserAuth
        const emailDuplicate = await Auth.default.findOne({emailUserAuth: email})

        if (emailDuplicate)
            throw new ExceptionHandler("The email already exists")

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const validateUserExists = async (req, res, next)  => {
    try {
        const userId = req.params.userId
        validateObjectId(userId, "userId")

        const userFound = await User.default.findById(userId)

        if (!userFound) 
            throw new ExceptionHandler("No User found")

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const validateUserFollowingExists = async (req, res, next)  => {
    try {
        const userId = req.body.followingUser
        validateObjectId(userId, "userId")

        const userFound = await User.default.findById(userId)

        if (!userFound) 
            throw new ExceptionHandler("No User Following found")

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const validateUserFriendRequestExists = async (req, res, next)  => {
    try {
        const userId = req.body.friendRequestsUser
        validateObjectId(userId, "friendRequestsUser")
    
        const userFound = await User.default.findById(userId)
        
        if (!userFound) 
            throw new ExceptionHandler("No User Following found")
        
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}



export const validateUserFriendExists = async (req, res, next)  => {
    try {
        const userId = req.body.friendsUser
        validateObjectId(userId, "friendsUser")

        const userFound = await User.default.findById(userId)
        
        if (!userFound) 
            throw new ExceptionHandler("The user doesn't exist")
        
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }   
}


export const validatePodcastExists = async (req, res, next)  => {
    try {
        const podcastId = req.params.podcastId
        validateObjectId(podcastId, "podcastId")

        const podcastFound = await Podcast.default.findById(podcastId)
        
        if (!podcastFound) 
            throw new ExceptionHandler("No Podcast found")
        
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const validatePodcastStatus = async (req, res, next)  => {
    try {
        const podcastId = req.params.podcastId

        const podcastFound = await Podcast.default.findById(podcastId).populate("statePodcast")

        const statePodcast = podcastFound.statePodcast.name

        switch(statePodcast){
            case State.stateTypes.OPEN:
                next()
            break;

            case State.stateTypes.PAUSED:
                //TODO: VALIDAR QUE LOS CLIP RESPONSES NO SE PUEDAN CREAR, PERO QUE SI LOS CLIP REQUEST
                //TODO: COMO SABER SI ES UN CLIP REQUEST O UN CLIP RESPONSE, SE PUEDE CON "soundFileClipResponse" Y "soundFileClipRequest"?
                throw new ExceptionHandler("No Clip Requests and Clip Responses allowed in Podcast paused")
            break;

            case State.stateTypes.CLOSED:
                throw new ExceptionHandler("No Clip Requests and Clip Responses allowed in Podcast paused")
            break;

            default:
        }
    }catch(exception){
        return handleException(req, res, exception);
    }
    
}

export const validatePrivacyExists = async (req, res, next)  => {
    try {
        const paramPrivacyFound = req.body.privacyPodcast

        const privacyByNameFound = await Privacy.default.findOne({name: paramPrivacyFound})   

        if (!privacyByNameFound) 
            throw new ExceptionHandler("No Privacy found")

        req.body.privacyPodcastId = privacyByNameFound._id

        next()

    }catch(exception){
        return handleException(req, res, exception);
    }    
}


export const validateStateExists = async (req, res, next)  => {
    try {
        const statePodcast = req.body.statePodcast
    
        const stateFound = await State.default.findOne({name: statePodcast})

        if (!stateFound) 
            throw new ExceptionHandler("No State found")

        req.body.statePodcastId = stateFound._id

        next()

    }catch(exception){
        return handleException(req, res, exception);
    }  
}

export const validateClipResponseExists = async (req, res, next)  => {
    try {
        const clipResponseId = req.params.clipResponseId
        validateObjectId(clipResponseId, "clipResponseId")
    
        const clipResponseFound = await ClipResponse.default.findById(clipResponseId)
    
        if (!clipResponseFound) 
            throw new ExceptionHandler("No Clip Response found")
    
        next()

    }catch(exception){
        return handleException(req, res, exception);
    }
}

const validateClipRequestExists = async (clipRequestId, req, res, next)  => {
    try {
        validateObjectId(clipRequestId, "clipRequestId")

        const clipRequestFound = await ClipRequest.default.findById(clipRequestId)

        if (!clipRequestFound)
            throw new ExceptionHandler("No Clip Request found")

        next()

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const validateClipRequestExistsParam = async (req, res, next)  => {
    validateClipRequestExists(req.params.clipRequestId, req, res, next)
}

export const validateClipRequestExistsBody = async (req, res, next)  => {
    validateClipRequestExists(req.body.clipRequestId, req, res, next)
}


export const validateClipRequestInPodcast = async (req, res, next)  => {
    try {
        const { podcastId } = req.params
        const { clipRequestId } = req.body

        const isClipRequestInPodcast = await Podcast.default.findOne({_id: podcastId, clipRequestPodcast: { $in : [clipRequestId]  }})
        if(!isClipRequestInPodcast) 
            throw new ExceptionHandler("The clip request does not belong to the podcast")
        
        next()

    }catch(exception){
        return handleException(req, res, exception);
    } 
}


export const validateUserAuthorizedClipRequest = async (req, res, next)  => {
    try {
        const podcastId = req.params.podcastId

        const podcastFound = await Podcast.default.findById(podcastId).populate("privacyPodcast").populate("statePodcast")

        const privacyPodcast = podcastFound.privacyPodcast.name

        const statePodcast = podcastFound.statePodcast.name

        if(statePodcast !== "open")
            throw new ExceptionHandler("The podcast is not open")

        switch(privacyPodcast){
            case Privacy.privacyTypes.PUBLIC:
                next()
            break;

            case Privacy.privacyTypes.ONLY_FRIENDS:
                const userLoggedId = req.userId

                const isUserFriend = await User.default.findOne({_id: podcastFound.authorPodcast, friendsUser: { $in : [userLoggedId]  }})

                if (!isUserFriend)
                    throw new ExceptionHandler("No Clip Requests allowed in privacy \"ONLY_FRIENDS\"")

                next();
                
            break;

            case Privacy.privacyTypes.ONLY_ME:
                throw new ExceptionHandler("No Clip Requests allowed in privacy \"ONLY_ME\"")
            break;

            default:
        }

    }catch(exception){
        return handleException(req, res, exception);
    }    
}

export const validatePodcastIsNotClosed = async (req, res, next) => {
    try {
        const podcastId = req.params.podcastId

        const podcastFound = await Podcast.default.findById(podcastId).populate("privacyPodcast").populate("statePodcast")
        const statePodcast = podcastFound.statePodcast.name
        if(statePodcast === "closed")
            throw new ExceptionHandler("The podcast has been closed")

        next()
        
    }catch(exception){
        return handleException(req,res,exception)
    }
}


export const validateClipRequestVoteIsCorrect = async (req, res, next)  => {
    try {
        const voteUser = req.body.voteUser

        if(Number(voteUser) !== 0 && Number(voteUser) !== 1) 
            throw new ExceptionHandler("Vote is incorrect")

        next()

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const validateCommentExists = async (req, res, next)  => {
    try {
        const commentId = req.params.commentId
        validateObjectId(commentId, "commentId")

        const commentFound = await Comment.default.findById(commentId)
        
        if (!commentFound) 
            throw new ExceptionHandler("No Comment found")
                
        next()

    }catch(exception){
        return handleException(req, res, exception);
    }
}
