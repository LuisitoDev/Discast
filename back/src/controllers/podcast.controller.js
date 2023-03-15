import Podcast from "../models/Podcast"
import UserModel from "../models/User"
import * as State from "../models/State"
import * as message from "../libs/statusResponse"
import ClipRequest from "../models/ClipRequest"
import ClipResponse from "../models/ClipResponse"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"
import {getFileDuration} from "../libs/fileDuration"
import User from "../models/User"
const mongoose = require('mongoose');

export const createPodcast = async (req, res,next) => {
    const imageFilePodcast = req.files.imageFilePodcast[0].id
    const clipResponseFileId = req.files.soundFileClipResponse[0].id
    
    const clipDuration = await getFileDuration(clipResponseFileId.toString())

    const {
        titlePodcast,
        privacyPodcastId,
        secondStartPreviewPodcast,
        secondEndPreviewPodcast,
    } = req.body
    try {
        
        const stateFound = await State.default.findOne({name: State.stateTypes.OPEN}) //TODO: ESTARÍA BIEN ESTO DEJARLO EN DEFAULT DEL MODEL

        const newPodcast = new Podcast({
            titlePodcast,
            privacyPodcast : privacyPodcastId,
            viewsNumberPodcast : 0,
            durationPodcast: clipDuration,
            authorPodcast : req.userId,
            imageFilePodcast,
            secondStartPreviewPodcast,
            secondEndPreviewPodcast,
            clipResponsesPodcast : req.clipResponse._id,
            statePodcast : stateFound._id
        })
        const session =req.session;
        const podcastSaved = await newPodcast.save({session})

        res.status(201).json(podcastSaved)
        next();

    }catch(exception){
        return handleException(req, res, exception);
    }
    
}

export const getPodcast = async (req, res) => {
    try {
        const podcasts = await Podcast.find().populate("privacyPodcast").populate("authorPodcast")
        res.json(podcasts)
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const getPodcastById = async (req, res) => {
    const podcastId = req.params.podcastId
    try {
        const podcast = await Podcast.findById(podcastId)
        .populate("privacyPodcast")
        .populate("authorPodcast")
        .populate("statePodcast")
        .populate("clipResponsesPodcast")
        .populate({ 
            path: 'clipResponsesPodcast',
            populate: {
              path: 'userClipResponse',
              model: 'User'
            } 
         })
        .populate("clipRequestPodcast")
        .populate({ 
            path: 'clipRequestPodcast',
            populate: {
              path: 'userClipRequest',
              model: 'User'
            } 
         })
      

        res.status(200).json(podcast)

    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getRecentPodcast = async (req, res) => {
    const { page } = req.params
    const {query} = req.query

    let matchObject = {}
    if(query){
        matchObject.titlePodcast = {$regex: query, $options: 'i'}    
    }
    
    const pageElements = 5;
    const startIndex = page * pageElements - pageElements;
    try {
        
        const podcasts = await Podcast.aggregate([
            {
                $lookup: {
                    from: "clip_responses",
                    localField:"clipResponsesPodcast",
                    foreignField:"_id",
                    as:"clipResponsesPodcast"
                }
            },
            {
                $project: {
                    "clipResponsesPodcast.usersLikesClipResponse" : 0,
                    "clipResponsesPodcast.createdAt" : 0,
                    "clipResponsesPodcast.updatedAt" : 0,

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"clipResponsesPodcast.userClipResponse",
                    foreignField: "_id",
                    as:"usersInPodcast"
                }
            },
            {
                $lookup: {
                    from: "privacies",
                    localField:"privacyPodcast",
                    foreignField: "_id",
                    as:"privacyPodcast"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"authorPodcast",
                    foreignField: "_id",
                    as:"authorPodcast"
                }
            },
            {
                $unwind: "$authorPodcast"
            },
            {
                $unwind: "$privacyPodcast"
            },
            
            {
                $lookup: {
                    from: "states",
                    localField:"statePodcast",
                    foreignField: "_id",
                    as:"statePodcast"
                }
            },
            {
                $unwind: "$statePodcast"
            },
            {
                $match: matchObject
            },
            {
                $sort: {createdAt: -1}
            }
        
        ]).skip(startIndex).limit(pageElements)

        res.json(podcasts)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getTopLikedPodcast = async (req, res) => {
    const { page } = req.params

    const {query} = req.query

    let matchObject = {
        likes:{$gt: 0}
    }

    if(query){
        matchObject.titlePodcast = {$regex: query, $options: 'i'}    
    }

    const pageElements = 5;
    const startIndex = page * pageElements - pageElements;
    try {
        // const podcasts = await Podcast.find().populate("privacyPodcast").populate("authorPodcast")
        const podcasts = await Podcast.aggregate([
            {
                $lookup: {
                    from: "clip_responses",
                    localField:"clipResponsesPodcast",
                    foreignField:"_id",
                    as:"clipResponsesPodcast"
                }
            },
            {
                $project: {
                    "clipResponsesPodcast.usersLikesClipResponse" : 0,
                    "clipResponsesPodcast.createdAt" : 0,
                    "clipResponsesPodcast.updatedAt" : 0,

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"clipResponsesPodcast.userClipResponse",
                    foreignField: "_id",
                    as:"usersInPodcast"
                }
            },
            {
                $lookup: {
                    from: "privacies",
                    localField:"privacyPodcast",
                    foreignField: "_id",
                    as:"privacyPodcast"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"authorPodcast",
                    foreignField: "_id",
                    as:"authorPodcast"
                }
            },
            {
                $unwind: "$authorPodcast"
            },
            {
                $lookup: {
                    from: "states",
                    localField:"statePodcast",
                    foreignField: "_id",
                    as:"statePodcast"
                }
            },
            {
                $unwind: "$statePodcast"
            },
            {
                $unwind: "$privacyPodcast"
            },

            {
                $addFields: {
                     likes: {$size: "$usersLikesPodcast"}   
                }
            },
            {
                $match:matchObject
            },
            {
                $sort: {likes: -1}
            }
        ]).skip(startIndex).limit(pageElements)
      
        res.json(podcasts)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getFollowingPodcast = async (req, res) => {
    const { page } = req.params

    

    const pageElements = 5
    const startIndex = page * pageElements - pageElements
    const userLoggedId = req.userId
    try {
        const userFound = await UserModel.findById(userLoggedId)
        const authorsFollowing =  userFound.followingUser
        console.log(authorsFollowing)
        if (!authorsFollowing) res.status(200).json({status: message.statusResponse.ERROR, message:"No users following found"})
    
        
        const {query} = req.query

        let matchObject = {
            "authorPodcast._id": {
                $in: authorsFollowing
            }
        }

        if(query){
            matchObject.titlePodcast = {$regex: query, $options: 'i'}    
        }

        const podcasts = await Podcast.aggregate([
            {
                $lookup: {
                    from: "clip_responses",
                    localField:"clipResponsesPodcast",
                    foreignField:"_id",
                    as:"clipResponsesPodcast"
                }
            },
            {
                $project: {
                    "clipResponsesPodcast.usersLikesClipResponse" : 0,
                    "clipResponsesPodcast.createdAt" : 0,
                    "clipResponsesPodcast.updatedAt" : 0,

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"clipResponsesPodcast.userClipResponse",
                    foreignField: "_id",
                    as:"usersInPodcast"
                }
            },
            {
                $lookup: {
                    from: "privacies",
                    localField:"privacyPodcast",
                    foreignField: "_id",
                    as:"privacyPodcast"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"authorPodcast",
                    foreignField: "_id",
                    as:"authorPodcast"
                }
            },
            {
                $unwind: "$authorPodcast"
            },
            {
                $lookup: {
                    from: "states",
                    localField:"statePodcast",
                    foreignField: "_id",
                    as:"statePodcast"
                }
            },
            {
                $unwind: "$statePodcast"
            },
            {
                $unwind: "$privacyPodcast"
            },
            {
                $match: matchObject
            },
            {
                $sort: {createdAt: -1}
            }
        
        ]).skip(startIndex).limit(pageElements)

        
        
        
        res.json(podcasts)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getPodcastCreated = async (req, res) => {
    const { page } = req.params
    const authorPodcast = req.userId

    const pageElements = 5
    const startIndex = page * pageElements - pageElements

    try {
        // const podcasts = await Podcast.find().populate("privacyPodcast").populate("authorPodcast")
        const podcasts = await Podcast.aggregate([
            {
                $lookup: {
                    from: "clip_responses",
                    localField:"clipResponsesPodcast",
                    foreignField: "_id",
                    as:"clipResponsesPodcast"
                }
            },
            {
                $lookup: {
                    from: "states",
                    localField:"statePodcast",
                    foreignField: "_id",
                    as:"statePodcast"
                }
            },
            {
                $lookup: {
                    from: "privacies",
                    localField:"privacyPodcast",
                    foreignField: "_id",
                    as:"privacyPodcast"
                }
            },
            {
                $addFields: {
                    responses: {$size: "$clipResponsesPodcast"},
                    requests: {$size: "$clipRequestPodcast"},
                    comments: {$size: "$commentsPodcast"},
                    likes: {$size: "$usersLikesPodcast"},
                }
            },
            {
                $unwind: "$clipResponsesPodcast"
            },
            {
                $unwind: "$statePodcast"
            },
            {
                $unwind: "$privacyPodcast"
            },
            {
                $group: {
                    _id: "$_id",
                    titlePodcast: {$first: "$titlePodcast"},
                    statePodcast: {$first: "$statePodcast"},
                    privacyPodcast: {$first: "$privacyPodcast"},
                    responses: {$first: "$responses"},
                    requests: {$first: "$requests"},
                    comments: {$first: "$comments"},
                    likes: {$first: "$likes"},
                    views: {$first: "$viewsNumberPodcast"},
                    imageFilePodcast: {$first: "$imageFilePodcast"},
                    authorPodcast: {$first: "$authorPodcast"},
                    createdAt: {$first: "$createdAt"},
                    usersInPodcast: {
                        $push: "$clipResponsesPodcast.userClipResponse"
                    }
                }
            },
            {
                $unwind: "$usersInPodcast"
            },
            {
                $group: {
                    _id: {user:"$usersInPodcast", podcastId: "$_id"},
                    count: {$sum: 1},
                    doc: {$first: {
                        podcastId: "$podcastId",
                        titlePodcast: "$titlePodcast",
                        statePodcast: "$statePodcast",
                        privacyPodcast: "$privacyPodcast",
                        responses: "$responses",
                        requests:"$requests",
                        comments: "$comments",
                        likes: "$likes",
                        views: "$views",
                        imageFilePodcast: "$imageFilePodcast",
                        authorPodcast: "$authorPodcast",
                        createdAt: "$createdAt"
                    }}
                }
            },
            {
                $group: {
                    _id: "$_id.podcastId",
                    usersParticipations: {$push: {userId: "$_id.user", count: "$count"}},
                    doc : {$first: "$doc"}
                }
            },
            {
                $addFields: {
                    mostActiveUser: {
                        $reduce: {
                            input: "$usersParticipations",
                            initialValue: {count: 1},
                            in: {$cond: [{$gte:["$$this.count", "$$value.count"]}, "$$this", "$$value"]}
                        }
                    }
                }
            },
            {
                $project: {
                    mostActiveUser: 1,
                    titlePodcast: "$doc.titlePodcast",
                    statePodcast: "$doc.statePodcast",
                    privacyPodcast: "$doc.privacyPodcast",
                    responses: "$doc.responses",
                    requests: "$doc.requests",
                    comments: "$doc.comments",
                    likes: "$doc.requests",
                    views: "$doc.views",
                    imageFilePodcast: "$doc.imageFilePodcast",
                    authorPodcast: "$doc.authorPodcast",
                    createdAt: "$doc.createdAt"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField:"mostActiveUser.userId",
                    foreignField: "_id",
                    as:"mostActiveUser"
                }
            },
            {
                $unwind: "$mostActiveUser"
            },
            {
                $match: {
                    authorPodcast
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]).skip(startIndex).limit(pageElements)    
        res.json(podcasts)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const updatePodcastById = async (req, res) => {
    const { podcastId } = req.params
    const podcastInfo = req.body
    try {
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, podcastInfo, { returnOriginal: false})
    
        res.status(200).json(updatedPodcast)
    }catch(exception){  
        return handleException(req, res, exception);
    }
}



export const imprimirAlarmsOne = async (req, res) => {
    const params = req.params
    const body = req.body
    try {
        console.log("params")
        console.log(params)
        console.log("body")
        console.log(body)

        res.status(200).json({params:params, body:body})
    }catch(exception){  
        return handleException(req, res, exception);
    }
}

export const getImagePodcastById = async (req, res, next) => {
    const podcastId = req.params.podcastId
    try {
        const podcast = await Podcast.findById(podcastId)
        req.hasFile = true;
        req.fileId = podcast.imageFilePodcast

        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateImagePodcastById = async (req, res, next) => {
    const { podcastId } = req.params
    const imageFilePodcast = req.files.imageFilePodcast[0].id

    try {
        const session =req.session;
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {imageFilePodcast},{session, returnOriginal:false})
        
        if (message.responseDebug){
            res.status(200).json(updatedPodcast)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})
        next()
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateStatePodcastById = async (req, res) => {
    const { podcastId } = req.params
    const { statePodcastId } = req.body
    
    try {
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {statePodcast: statePodcastId}, { returnOriginal: false})
    
        if (message.responseDebug){
            res.status(200).json(updatedPodcast)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updatePodcastAddClipResponse = async (req, res,next) => {
    const { podcastId } = req.params
    const clipResponseFileId = req.files.soundFileClipResponse[0].id


    try {
        const clipDuration = await getFileDuration(clipResponseFileId.toString())

        const session = req.session;
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {$push: { clipResponsesPodcast: req.clipResponse._id }, $inc: { durationPodcast: clipDuration }}, { session,returnOriginal: false} )

        if (message.responseDebug){
            res.status(200).json(updatedPodcast)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS, clipResponse: req.clipResponse})

        next();
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updatePodcastClipRequestToResponse = async(req, res) => {
    const { podcastId } = req.params
    const {clipRequestId} = req.body

    try {
        
        const clipRequest = await ClipRequest.findById(clipRequestId)

        const clipResponseFileId = clipRequest.soundFileClipRequest
        const clipDuration = await getFileDuration(clipResponseFileId.toString())

        //1. extract clipRequest fields and create a new Clip Response then update ClipResponses array in podcast
        const newClipResponse = new ClipResponse({
                                                userClipResponse:clipRequest.userClipRequest
                                                ,soundFileClipResponse: clipRequest.soundFileClipRequest
                                                //,usersLikesClipResponse: clipRequest.usersLikesClipRequest 
                                                })

        const clipResponseSaved = await newClipResponse.save()
        if(!clipResponseSaved) throw new ExceptionHandler("Error creating clipResponse")
        
        
        //2. update ClipRequest array in podcastm and delete old clipRequest
        await Podcast.findByIdAndUpdate(podcastId, {$pull: {clipRequestPodcast: clipRequestId}, $push: {clipResponsesPodcast: clipResponseSaved._id}, $inc: { durationPodcast: clipDuration } })
        const deleteClipRequest = await ClipRequest.deleteOne({_id: clipRequestId})

        const userInfo = await User.findById(clipRequest.userClipRequest);

        let clipResponseObject = clipResponseSaved.toObject();

        clipResponseObject.userClipResponse = userInfo;

        clipResponseObject.podcastId = podcastId;
        
        res.status(200).json({status: message.statusResponse.SUCCESS, clipResponse: clipResponseObject})
        
    }catch(exception){
        return handleException(req, res, exception);
    }

}

export const updatePodcastAddClipRequest = async (req, res, next) => {
    const { podcastId } = req.params

    try {
        const session = req.session
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {$push: { clipRequestPodcast: req.clipRequest._id }}, { session,returnOriginal: false} )

        if (message.responseDebug){
            res.status(200).json(updatedPodcast)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS, clipRequest: req.clipRequest})

        next()
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updatePodcastAddComment = async (req, res,next) => {
    const { podcastId } = req.params
    try {
        const session = req.session
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {$push: { commentsPodcast: req.commentId }}, { session,returnOriginal: false } )
        
        if (message.responseDebug){
            res.status(200).json(updatedPodcast)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})

        next()

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateLikesToPodcast = async (req, res) => {
    const { podcastId } = req.params
    const idUserLikePodcast = req.userId

    try {
        const podcastFound = await Podcast.findById(podcastId)

        const userHasLikedPodcast = podcastFound.usersLikesPodcast.includes(idUserLikePodcast)

        let updatedPodcast = null

        if (userHasLikedPodcast === false){
            //Si no le ha dado like, entonces se agrega el usuario del arreglo
            updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {$push: { usersLikesPodcast: idUserLikePodcast }}, { returnOriginal: false } )
        }
        else{
            //Si ya le ha dado like, entonces se quita el usuario del arreglo
            updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {$pull: { usersLikesPodcast: idUserLikePodcast }}, { returnOriginal: false } )
        }

        if (message.responseDebug){
            res.status(200).json(updatedPodcast)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateViewsToPodcast = async (req,res) => {
    const { podcastId } = req.params
   

    
    try {
        const updatedPodcast = await Podcast.findByIdAndUpdate(podcastId, {$inc:{viewsNumberPodcast: 1}})
        res.status(200).json(updatedPodcast)

    }catch(e){
        writeLog(e);
        return res.status(403).json({status: message.statusResponse.ERROR, message:"An error has ocurred"})
    }
}

export const deletePodcastById = async (req, res) => {
    const { podcastId } = req.params
    
    try {

        await Podcast.findByIdAndDelete(podcastId)
        res.status(204).json({status: message.statusResponse.SUCCESS})
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}
