import {body, validationResult} from "express-validator"
import {validationHandler, messagesFields} from './validationHandler'
import {validateDuplicateEmail} from '../validateObjects'



export const signIn = [
    body('emailUserAuth')
        .exists().withMessage(messagesFields.emptyField).bail()
        .isEmail().withMessage(messagesFields.invalidEmail),
    body('passwordUserAuth')
        .exists().withMessage(messagesFields.emptyField).bail(),
    validationHandler
];


export const signUp = [
    body('emailUserAuth')
        .exists().withMessage(messagesFields.emptyField)
        .isEmail().withMessage(messagesFields.invalidEmail),
    body('passwordUserAuth')
        .exists().withMessage(messagesFields.emptyField)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$.%^&*])(?=.{8,})/).withMessage('The password is not strong enough'),
    body('nameUser')
        .exists().withMessage(messagesFields.emptyField),
    body('apPaternoUser')
        .exists().withMessage(messagesFields.emptyField),
    body('apMaternoUser')
        .exists().withMessage(messagesFields.emptyField),
    validationHandler,

    validateDuplicateEmail
];

export const updateChangePassword = [
    body('lastPassword')
        .exists().withMessage(messagesFields.emptyField),
    body('newPassword')
        .exists().withMessage(messagesFields.emptyField)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$.%^&*])(?=.{8,})/).withMessage('The password is not strong enough'),
    validationHandler
];