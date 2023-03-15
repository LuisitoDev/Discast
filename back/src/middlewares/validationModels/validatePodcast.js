import {body, param, check, checkSchema} from 'express-validator'
import multiparty from 'multiparty'
import {validationHandler, messagesFields} from './validationHandler'
import {validatePodcastExists, validatePrivacyExists, validateStateExists, 
        validateUserAuthorizedClipRequest, validateClipRequestExistsBody, validateClipRequestInPodcast, validatePodcastIsNotClosed,
        isAuthorPodcast} from '../validateObjects'



export const getPodcast = [
    param('podcastId')
        .exists(),
    validationHandler,

    validatePodcastExists
];

export const getPodcastByPage = [
    param('page')
        .exists().withMessage(messagesFields.notSendedField)
        .isInt({min:1}).withMessage(messagesFields.mustBeNumericAndPositive),
    validationHandler
];


export const createPodcast = [
    check('titlePodcast')
                .exists().withMessage(messagesFields.notSendedField).bail()
                .notEmpty().withMessage(messagesFields.emptyField),
    check('privacyPodcast')
                .exists().withMessage(messagesFields.notSendedField).bail()
                .notEmpty().withMessage(messagesFields.emptyField),
    check('secondStartPreviewPodcast')
                .exists().withMessage(messagesFields.notSendedField).bail()
                .notEmpty().withMessage(messagesFields.emptyField)
                .isNumeric().withMessage(messagesFields.fieldMustBeNumeric),
    check('secondEndPreviewPodcast')
                .exists().withMessage(messagesFields.notSendedField).bail()
                .notEmpty().withMessage(messagesFields.emptyField)
                .isNumeric().withMessage(messagesFields.fieldMustBeNumeric),
    checkSchema({
        'imageFilePodcast':{
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: "This image file is required"
            }
        },
        'soundFileClipResponse' : {
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: "This sound file clip is required"
            }
        }
    }),
    validationHandler,
    validatePrivacyExists
]


export const updatePodcast = [
    param('podcastId')
        .exists(),
    body('titlePodcast')
        .exists().withMessage(messagesFields.emptyField).bail(),
    body('privacyPodcast')
        .exists().withMessage(messagesFields.emptyField).bail(),
    body('secondStartPreviewPodcast')
        .exists().withMessage(messagesFields.emptyField).bail(),
    body('secondEndPreviewPodcast')
        .exists().withMessage(messagesFields.emptyField).bail(),

    validationHandler,

    validatePodcastExists,

    validatePrivacyExists,

    isAuthorPodcast
]


export const updateImagePodcast = [
    param('podcastId')
        .exists(),
    checkSchema({
        'imageFilePodcast':{
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: "This image file is required"
            }
        }
    }),        
    validationHandler,

    validatePodcastExists,

    isAuthorPodcast
]


export const updateStatePodcast = [
    param('podcastId')
        .exists(),
    body('statePodcast')
        .exists().withMessage(messagesFields.notSendedField).bail(),

    validationHandler,
    validatePodcastExists,
    validatePodcastIsNotClosed,
    validateStateExists,

    isAuthorPodcast
]


export const updatePodcastAddClipResponse = [
    param('podcastId')
        .exists(),
    checkSchema({
        'soundFileClipResponse' : {
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: "This sound file clip is required"
            }
        }
    }),
    validatePodcastIsNotClosed
    ,
    validationHandler,

    validatePodcastExists,

    isAuthorPodcast
]

export const updatePodcastAddClipRequest = [
    param('podcastId')
        .exists(),
    check('titleClipRequest')
         .exists().withMessage(messagesFields.notSendedField).bail(),
    check('secondStartPreviewClipRequest')
         .exists().withMessage(messagesFields.notSendedField).bail(),
    check('secondEndPreviewClipRequest')
         .exists().withMessage(messagesFields.notSendedField).bail(),
    checkSchema({
        'soundFileClipRequest' : {
            custom: {
                options: (value, {req, path}) => !!req.files[path],
                errorMessage: "This sound file clip is required"
            }
        }
    }),
    validationHandler,

    validatePodcastExists,

    validateUserAuthorizedClipRequest
]

export const updatePodcastAddComment = [
    param('podcastId')
        .exists(),
    body('textComment')
        .exists(),
    validationHandler,

    validatePodcastExists
]


export const updatePodcastClipRequestToResponse = [
    param('podcastId')
        .exists(),
        
    body('clipRequestId')
        .exists(),

    validationHandler,

    validatePodcastExists,
    validateClipRequestExistsBody,
    validateClipRequestInPodcast
]


export const updateLikesToPodcast = [
    param('podcastId')
        .exists(),
    validationHandler,

    validatePodcastExists
]

export const deletePodcast = [
    param('podcastId')
        .exists(),
    validationHandler,
    
    validatePodcastExists,

    isAuthorPodcast
]
