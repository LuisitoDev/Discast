import { body, param, validationResult } from "express-validator";
import { validationHandler, messagesFields } from "./validationHandler";
import {
  validatePodcastExists,
  validateCommentExists,
  isAuthorComment,
} from "../validateObjects";

export const getComment = [
  param("commentId").exists().withMessage(messagesFields.notSendedField),
  validationHandler,

  validateCommentExists,
];

export const getCommentsByPodcastPage = [
  param("podcastId").exists().withMessage(messagesFields.notSendedField),
  param("page")
    .exists()
    .withMessage(messagesFields.notSendedField)
    .isInt({ min: 1 })
    .withMessage(messagesFields.mustBeNumericAndPositive),
  validationHandler,

  validatePodcastExists,
];

export const updateComment = [
  param("commentId").exists().withMessage(messagesFields.notSendedField),
  body("textComment").exists(),
  validationHandler,

  validateCommentExists,

  isAuthorComment,
];

export const deleteComment = [
  param("commentId").exists().withMessage(messagesFields.notSendedField),
  validationHandler,

  validateCommentExists,

  isAuthorComment,
];
