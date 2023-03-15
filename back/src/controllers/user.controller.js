import UserModel from "../models/User"
import Podcast from "../models/Podcast"
import ClipResponse from "../models/ClipResponse"
import ClipRequest from "../models/ClipRequest"
import Comment from "../models/Comment"
import * as message from "../libs/statusResponse"
import { generateEncryptedToken } from "../libs/tokenManager"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"

export const  createUser = async (req, res,next) => {

    const { nameUser,  apPaternoUser, apMaternoUser } = req.body

    const emailUser =  req.authId
    try {
        const newUserModel = new UserModel({
            emailUser,
            nameUser,
            apPaternoUser,
            apMaternoUser
        })
        const session = req.session
        const savedUserModel = await newUserModel.save({session})
        console.log(savedUserModel)
    
        if (!savedUserModel) return res.status(403).json({status: message.statusResponse.ERROR, message: "Error creating user"})
    
        const token = generateEncryptedToken(savedUserModel.emailUser)
    
        res.status(200).json({status: message.statusResponse.SUCCESS, token: token})
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getUserById = async (req, res) => {
    const userId = req.params.userId
    try {
        const userFound = await UserModel.findById(userId)
        res.status(200).json(userFound)
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const getUserInfoProfile = async (req, res) => {
    const userId = req.userId

    try {
        const userFound = await UserModel.findById(userId)
        .populate("emailUser")
        .populate("friendRequestsUser")
        .populate("friendsUser")
    
        res.status(200).json(userFound)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getStatsUser = async (req, res) => {
    const userId = req.userId

    try {
        
        const podcastCreated = await Podcast.find({authorPodcast:userId})
        const clipResponseCreated = await ClipResponse.find({userClipResponse:userId})
        const clipRequestCreated = await ClipRequest.find({userClipRequest:userId})
        const commentCreated = await Comment.find({userComment:userId})
        
        const stats = {
            totalPodcast:       podcastCreated.length,
            totalClipResponse:  clipResponseCreated.length,
            totalClipRequest:   clipRequestCreated.length,
            totalComment:       commentCreated.length
        }

        res.status(200).json(stats)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getFavoriteUser = async (req, res) => {
    const userId = req.userId

    try {
        // const podcastLiked = await Podcast.find({usersLikesPodcast : { $in : [userId]  } })
        const favoriteUserCursor = await Podcast.aggregate([
            {
                $match: {
                    usersLikesPodcast: {$in: [userId]}
                }
                
            },
            {
                $group: {
                    _id: "$authorPodcast",
                    podcastLiked: {$sum: 1} 
                }
            },
            {
                $sort: {
                    podcastLiked: -1
                }
            },
            {
                $limit: 1
            },
            {
                $lookup: {
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"authorPodcast"
                }
            },
            {
                $unwind: "$authorPodcast"
            }
        ])
            let favoriteUser = null
            if(favoriteUserCursor.length){
                favoriteUser = favoriteUserCursor[0]
            }
        
        res.status(200).json(favoriteUser)
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const updateUserAddFollowers = async (req, res) => {
    
    const userId  = req.userId
    const { followingUser } = req.body


    try {
        const userFollowerFound = await UserModel.findOne({_id: followingUser, followersUser: { $in : [userId]  }}) //Ya con esto no se ocupa el "array.includes(idUser)"
        
        let updatedUserFollower = null
        if (!userFollowerFound){
            updatedUserFollower = await UserModel.findByIdAndUpdate(followingUser, {$push: { followersUser: userId }}, { returnOriginal: false } )
            await UserModel.findByIdAndUpdate(userId, {$push: { followingUser: followingUser }}, { returnOriginal: false })
        }
        else{
            updatedUserFollower = await UserModel.findByIdAndUpdate(followingUser, {$pull: { followersUser: userId }}, { returnOriginal: false } )
            await UserModel.findByIdAndUpdate(userId, {$pull: { followingUser: followingUser }}, { returnOriginal: false })
        }
    


        res.status(200).json({status: message.statusResponse.SUCCESS})
    }catch(exception){
        return handleException(req, res, exception);
    }
}

//TODO: DEPRECATED
export const updateUserAddFollowing = async (req, res) => {
    const userId  = req.userId    
    const { followingUser } = req.body

    try {
        const userFollowFound = await UserModel.findOne({_id: userId, followingUser: { $in : [followingUser]  } })
        
        let updatedUser = null
        if (!userFollowFound){
            updatedUser = await UserModel.findByIdAndUpdate(userId, {$push: { followingUser: followingUser }}, { returnOriginal: false })
            await UserModel.findByIdAndUpdate(followingUser, {$push: {followersUser: userId}})
        }
        else {
            updatedUser = await UserModel.findByIdAndUpdate(userId, {$pull: { followingUser: followingUser }}, { returnOriginal: false })      
            UserModel.findByIdAndUpdate(followingUser, {$pull: {followersUser: userId}})
        }
    
        res.status(200).json(updatedUser)

    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const updateUserAddFriendRequest = async (req, res) => {
    const userId  = req.userId
    const { friendRequestsUser } = req.body
    try {
        const isUserAdded = await UserModel.findOne({_id: friendRequestsUser, friendsUser: { $in : [userId]  }})

        if (isUserAdded)
            return res.status(304).json({status: message.statusResponse.SUCCESS, message:'The user was already added', friend_added: true})


        const userFriendRequestFound = await UserModel.findOne({_id: friendRequestsUser, friendRequestsUser: { $in : [userId]  }})
        
        let updatedUser = null
        if (!userFriendRequestFound)
            updatedUser = await UserModel.findByIdAndUpdate(friendRequestsUser, {$push: { friendRequestsUser: userId }}, { returnOriginal: false} )
        else
            updatedUser = await UserModel.findByIdAndUpdate(friendRequestsUser, {$pull: { friendRequestsUser: userId }}, { returnOriginal: false } )
    
        
        if(updatedUser && !userFriendRequestFound)
            res.status(200).json({status: message.statusResponse.SUCCESS, message:'The friend request was sended correctly'})
        else if (updatedUser && userFriendRequestFound)
            res.status(200).json({status: message.statusResponse.SUCCESS, message:'The friend request was canceled correctly'})
        else 
            res.status(200).json({status: message.statusResponse.ERROR, message:'The friend request could not be sended'})

    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateUserAddFriend = async (req, res) => {
    const userId  = req.userId
    const { friendsUser } = req.body

    
    try {
      
        const friendInUser = await UserModel.findOne({_id: userId, friendsUser:{$in : [friendsUser]}})
        
        let updatedUser = null
        if(friendInUser){
            await UserModel.findByIdAndUpdate(userId, {$pull: { friendsUser: friendsUser }}, { returnOriginal: false} )
            await UserModel.findByIdAndUpdate(friendsUser, {$pull: { friendsUser: userId }}, { returnOriginal: false} )
            
            res.status(200).json({status: message.statusResponse.SUCCESS, message:'User friend removed succesfully'})

        } else {
            await UserModel.findByIdAndUpdate(userId, {$push: { friendsUser: friendsUser }}, { returnOriginal: false} )
            await UserModel.findByIdAndUpdate(userId, {$pull: { friendRequestsUser: friendsUser}})

            await UserModel.findByIdAndUpdate(friendsUser, {$push: { friendsUser: userId }}, { returnOriginal: false} )
            res.status(200).json({status: message.statusResponse.SUCCESS, message:'User friend added succesfully'})
        }


        
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const updateUserDeclineFriend = async (req, res) => {
    const userId  = req.userId
    const { friendsUser } = req.body

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {$pull: { friendRequestsUser: friendsUser }}, { returnOriginal: false} )
    
        if(updatedUser)
            res.status(200).json({status: message.statusResponse.SUCCESS, message:'The friend request was declined correctly'})
        else 
            res.status(200).json({status: message.statusResponse.ERROR, message:'The friend request could not be declined'})
    }catch(exception){
        return handleException(req, res, exception);
    }
}



export const getImageUserById = async (req, res, next) => {
    const userId = req.userId
    try {
        const userFound = await UserModel.findById(userId)
        
        if (userFound.imageFileUser){
            req.hasFile = true
            req.fileId = userFound.imageFileUser
        }
        else
            req.hasFile = false

        next()
    }catch(exception){
        return handleException(req, res, exception);

    }
}

export const updateUserById = async (req, res) => {
    const userId  = req.userId
    const userInfo = req.body
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, userInfo, { returnOriginal: false})
    
        res.status(200).json({status: message.statusResponse.SUCCESS})
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const updateImageUserById = async (req, res,next) => {
    const userId = req.userId
    const imageFileUser = req.files.imageFileUser[0].id

    try {
        const session = req.session;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { $set: {imageFileUser } } , { session,returnOriginal: false })

        if (message.responseDebug){
            res.status(200).json(updatedUser)
        }
        else
            res.status(200).json({status: message.statusResponse.SUCCESS})

        next()
        
    }catch(exception){  
        return handleException(req, res, exception);
    }
}


export const deleteUserById = async (req, res) => {
    const userId  = req.userId    
    try {
        await User.findByIdAndDelete(userId)
        res.status(204).json({status: message.statusResponse.SUCCESS})
    }catch(exception){
        return handleException(req, res, exception);
    }
}