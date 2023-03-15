import {body, param, validationResult, checkSchema} from 'express-validator'
import {validationHandler, messagesFields} from './validationHandler'
import {validateUserExists, validateUserFollowingExists, validateUserFriendRequestExists, validateUserFriendExists} from '../validateObjects'



export const getUser = [
    param('userId')
        .exists().withMessage(messagesFields.emptyField),
    validationHandler,

    validateUserExists
];

export const updateUser = [
    body('nameUser')
        .exists().withMessage(messagesFields.emptyField),
    body('apPaternoUser')
        .exists().withMessage(messagesFields.emptyField),
    body('apMaternoUser')
        .exists().withMessage(messagesFields.emptyField),
    validationHandler    
]

export const updateUserFollows = [
    validateUserFollowingExists
]

export const updateUserImage = [
    checkSchema({
        'imageFileUser' : {
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: "This user image file is required"
            }
        }
    }),
    validationHandler
]

export const updateUserFriendRequests = [
    validateUserFriendRequestExists
]

export const updateUserFriends = [
    validateUserFriendExists
]
