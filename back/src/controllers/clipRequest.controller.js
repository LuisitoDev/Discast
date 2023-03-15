import mongoose from "mongoose"
import ClipRequest from "../models/ClipRequest"
import * as message from "../libs/statusResponse"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"
import Podcast from "../models/Podcast"
import User from "../models/User"

export const createClipRequest = async (req, res, next) => {
    const { podcastId } = req.params
    const soundFileClipRequest = req.files.soundFileClipRequest[0].id
    
    const {titleClipRequest, secondStartPreviewClipRequest, secondEndPreviewClipRequest} = req.body
    console.log(req.body);
    
    const userClipRequest = req.userId

    try {
        const newClipRequest = new ClipRequest({titleClipRequest, secondStartPreviewClipRequest, secondEndPreviewClipRequest, soundFileClipRequest, userClipRequest})
        
        const session = req.session;
        const clipRequestSaved = await newClipRequest.save({session})
    
        if (!clipRequestSaved) return res.status(403).json({message: "Error creating clipRequest"})
    
        const userInfo = await User.findById(userClipRequest);

        let clipRequestObject = clipRequestSaved.toObject();

        clipRequestObject.userClipRequest = userInfo;

        clipRequestObject.podcastId = podcastId;
        
        req.clipRequest = clipRequestObject;

        // req.clipRequestId = clipRequestSaved._id
    
        next();
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const getClipRequest = async (req, res) => {
    try {
        const clipRequests = await ClipRequest.find().populate("userClipRequest")
    
        res.json(clipRequests)
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const getClipRequestById = async (req, res) => {
    const clipRequestId = req.params.clipRequestId
    try {
        const clipRequest = await ClipRequest.findById(clipRequestId).populate("userClipRequest")
    
        res.status(200).json(clipRequest)
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getClipRequestByPodcast = async (req, res) => {
    const {podcastId, page} = req.params
    const pageElements = 5;
    const startIndex = page * pageElements - pageElements;
    try {
        // const clipRequests = await ClipRequest.find().populate("userClipRequest")
        const clipRequests = await ClipRequest.aggregate([
            {
                $lookup: {
                    from: "podcasts",
                    localField:"_id",
                    foreignField:"clipRequestPodcast",
                    as:"podcastId"
                }
            },
            {
                $lookup: {
                    from:"users",
                    localField:"userClipRequest",
                    foreignField:"_id",
                    as:"userClipRequest"
                }
            },
            {
                $unwind: "$userClipRequest"
            },
            {
                $set: {
                    podcastId: {$arrayElemAt: ["$podcastId._id",0]},
                }
               
            },
            {
                $match: {podcastId : mongoose.Types.ObjectId(podcastId)}
            }
            
        ]).skip(startIndex).limit(pageElements);
        
        res.json(clipRequests)
    }catch(exception){
        return handleException(req, res, exception);
    }

}

export const updateClipRequestById = async (req, res) => {
    const {clipRequestId} = req.params
    const clipRequestInfo = req.body

    try {
        const updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, clipRequestInfo,  { returnOriginal: false } )

        if (!updatedClipRequest) return res.status(403).json({status: message.statusResponse.ERROR, message:"An error has ocurred"})

        if (message.responseDebug){
            res.status(200).json(updatedClipRequest)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const updateVotesToClipRequest = async (req, res) => {
    const { clipRequestId } = req.params
    const idUserVoteClipRequest = req.userId
    const { voteUser } = req.body

    try {
        const clipRequestFound = await ClipRequest.findById(clipRequestId)

        let updatedClipRequest = null

        if (voteUser === 1){
            const userHasLikedClipRequest = clipRequestFound.usersLikesClipRequest.includes(idUserVoteClipRequest)

            if (userHasLikedClipRequest === false){
                //Si no le ha dado like, entonces se agrega el usuario del arreglo
                updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, {$push: { usersLikesClipRequest: idUserVoteClipRequest }}, { returnOriginal: false } )

                const userHasDislikedClipRequest = clipRequestFound.usersDislikesClipRequest.includes(idUserVoteClipRequest)
                if(userHasDislikedClipRequest !== false) //Si previamente el usuario tenía un dislike, se lo quitamos del arreglo
                    updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, {$pull: { usersDislikesClipRequest: idUserVoteClipRequest }}, { returnOriginal: false } )
            }
            else{
                //Si ya le ha dado like, entonces se quita el usuario del arreglo
                updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, {$pull: { usersLikesClipRequest: idUserVoteClipRequest }}, { returnOriginal: false } )
            }
        }
        else if (voteUser === 0){
            const userHasDislikedClipRequest = clipRequestFound.usersDislikesClipRequest.includes(idUserVoteClipRequest)

            if (userHasDislikedClipRequest === false){
                //Si no le ha dado like, entonces se agrega el usuario del arreglo
                updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, {$push: { usersDislikesClipRequest: idUserVoteClipRequest }}, { returnOriginal: false } )

                const userHasLikedClipRequest = clipRequestFound.usersLikesClipRequest.includes(idUserVoteClipRequest)
                if(userHasLikedClipRequest !== false) //Si previamente el usuario tenía un like, se lo quitamos del arreglo
                    updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, {$pull: { usersLikesClipRequest: idUserVoteClipRequest }}, { returnOriginal: false } )
            }
            else{
                //Si ya le ha dado like, entonces se quita el usuario del arreglo
                updatedClipRequest = await ClipRequest.findByIdAndUpdate(clipRequestId, {$pull: { usersDislikesClipRequest: idUserVoteClipRequest }}, { returnOriginal: false } )
            }
        }
        else{
            return res.status(403).json({status: message.statusResponse.ERROR, message:"Vote undefined"})
        }
        
        if (message.responseDebug){
            res.status(200).json(updatedClipRequest)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const deleteClipRequestById = async (req, res) => {
    const {clipRequestId} = req.params

    try {
        
        await ClipRequest.findByIdAndDelete(clipRequestId);
        res.status(204).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const deleteClipRequestByPodcastAndId = async (req, res) => {
    const { podcastId, clipRequestId } = req.params;

    try {
        
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, { $pull: { clipRequestPodcast: clipRequestId } }, { returnOriginal: false } )
        await ClipRequest.findByIdAndDelete(clipRequestId);
        
        res.status(204).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}