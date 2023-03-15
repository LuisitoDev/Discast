import mongoose from "mongoose"
import ClipResponse from "../models/ClipResponse"
import * as message from "../libs/statusResponse"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"
import User from "../models/User"

export const createClipResponse = async (req, res, next) => {
    const { podcastId } = req.params
    const soundFileClipResponse = req.files.soundFileClipResponse[0].id
    const userClipResponse = req.userId

    try {
        const newClipResponse = new ClipResponse({userClipResponse, soundFileClipResponse})
        
        const session = req.session;
        const clipResponseSaved = await newClipResponse.save({session})
    
        if (!clipResponseSaved) return res.status(403).json({message: "Error creating clipResponse"})
        
        const userInfo = await User.findById(userClipResponse);

        let clipResponseObject = clipResponseSaved.toObject();

        clipResponseObject.userClipResponse = userInfo;

        clipResponseObject.podcastId = podcastId;

        req.clipResponse = clipResponseObject;

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }

}

export const getClipResponse = async (req, res) => {
    try {
        const clipResponses = await ClipResponse.find().populate("userClipResponse")
    
        res.json(clipResponses)
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const getClipResponseById = async (req, res) => {
    const clipResponseId = req.params.clipResponseId
    try {
        const clipResponse = await ClipResponse.findById(clipResponseId).populate("userClipResponse")
    
        res.status(200).json(clipResponse)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getClipResponseByPodcast = async (req, res) => {
    const {podcastId, page} = req.params
    const pageElements = 5;
    const startIndex = page * pageElements - pageElements;
    try {
        // const clipResponses = await ClipResponse.find().populate("userClipResponse")
        const clipResponses = await ClipResponse.aggregate([
            {
                $lookup: {
                    from: "podcasts",
                    localField:"_id",
                    foreignField:"clipResponsesPodcast",
                    as:"podcastId"
                }
            },
            {
                $lookup: {
                    from:"users",
                    localField:"userClipResponse",
                    foreignField:"_id",
                    as:"userClipResponse"
                }
            },
            {
                $unwind: "$userClipResponse"
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
        res.json(clipResponses)
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateClipResponseById = async (req, res) => {
    const {clipResponseId} = req.params
    const clipResponseInfo = req.body
    try {
        const updatedClipResponse = await ClipResponse.findByIdAndUpdate(clipResponseId, clipResponseInfo,  { returnOriginal: false } )
    
        if (message.responseDebug){
            res.status(200).json(updatedClipResponse)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const updateLikesToClipResponse = async (req, res) => {
    const { clipResponseId } = req.params
    const idUserLikeClipResponse = req.userId

    try {
        const clipResponseFound = await ClipResponse.findById(clipResponseId)

        const userHasLikedClipResponse = clipResponseFound.usersLikesClipResponse.includes(idUserLikeClipResponse)

        let updatedClipResponse = null

        if (userHasLikedClipResponse === false){
            //Si no le ha dado like, entonces se agrega el usuario del arreglo
            updatedClipResponse = await ClipResponse.findByIdAndUpdate(clipResponseId, {$push: { usersLikesClipResponse: idUserLikeClipResponse }}, { returnOriginal: false } )
        }
        else{
            //Si ya le ha dado like, entonces se quita el usuario del arreglo
            updatedClipResponse = await ClipResponse.findByIdAndUpdate(clipResponseId, {$pull: { usersLikesClipResponse: idUserLikeClipResponse }}, { returnOriginal: false } )
        }
        
        if (message.responseDebug){
            res.status(200).json(updatedClipResponse)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const deleteClipResponseById = async (req, res) => {
    const {clipResponseId} = req.params

    try {
        const deletedClipResponse = await ClipResponse.findByIdAndUpdate(clipResponseId, {deletedAt: new Date(Date.now()).toISOString()},  { returnOriginal: false } )
    
        if (message.responseDebug){
            res.status(204).json(deletedClipResponse)
        }
        else
            res.status(204).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}