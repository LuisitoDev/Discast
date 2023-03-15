import {body, param, validationResult} from "express-validator"
import {validationHandler, messagesFields} from './validationHandler'
import {validatePodcastExists, validateClipRequestExistsParam, validateClipRequestVoteIsCorrect, isAuthorClipRequest, isAuthorPodcast, isAuthorPodcastOrClipRequest} from '../validateObjects'





export const createClipRequest = [
    body('titleClipRequest')
        .exists(),
    body('secondStartPreviewClipRequest')
        .exists(),
    body('secondEndPreviewClipRequest')
        .exists(),
   validationHandler
];


export const updateClipRequest = [
    param('clipRequestId')
        .exists(),
    body('titleClipRequest')
        .exists(),
    validationHandler,

    validateClipRequestExistsParam,

    isAuthorClipRequest
];

export const updateVotesToClipRequest = [
    param('clipRequestId')
        .exists(),
    body('voteUser')
        .exists(),
    validationHandler,

    validateClipRequestExistsParam,
    validateClipRequestVoteIsCorrect
];

export const getClipRequestById = [
    param('clipRequestId')
        .exists(),
    validationHandler,

    validateClipRequestExistsParam
];


export const getClipRequestByPodcastPage = [
    param('podcastId')
        .exists().withMessage(messagesFields.notSendedField),
    param('page')
        .exists().withMessage(messagesFields.notSendedField)
        .isInt({min:1}).withMessage(messagesFields.mustBeNumericAndPositive),
    validationHandler,

    validatePodcastExists
]

export const deleteClipRequestById = [
    param('clipRequestId')
        .exists(),
        
    validationHandler,

    validateClipRequestExistsParam, 

    isAuthorClipRequest
];

export const deleteClipRequestByPodcastAndId= [
    param('podcastId')
        .exists(),
    param('clipRequestId')
        .exists(),

    validationHandler,

    validatePodcastExists,
    validateClipRequestExistsParam, 

    isAuthorPodcast
];
