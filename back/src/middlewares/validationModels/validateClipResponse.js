import {body, header, param, validationResult} from "express-validator"
import {validationHandler, messagesFields} from './validationHandler'
import {validatePodcastExists, validateClipResponseExists, isAuthorClipResponse} from '../validateObjects'




export const getClipResponse = [
    param('clipResponseId')
        .exists().withMessage(messagesFields.emptyField),
    validationHandler,

    validateClipResponseExists
];


export const getClipResponseByPodcastPage = [
    param('podcastId')
        .exists().withMessage(messagesFields.notSendedField),
    param('page')
        .exists().withMessage(messagesFields.notSendedField)
        .isInt({min:1}).withMessage(messagesFields.mustBeNumericAndPositive),
    validationHandler,

    validatePodcastExists    
]

export const createClipResponse = [
    
]

export const updateLikesToClipResponse = [
    param('clipResponseId')
        .exists(),
    validationHandler,

    validateClipResponseExists
];


export const deleteClipResponse = [
    param('clipResponseId')
        .exists(),
    validationHandler,
    
    validateClipResponseExists,

    isAuthorClipResponse
];




