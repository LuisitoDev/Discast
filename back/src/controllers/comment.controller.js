import mongoose from "mongoose";
import Comment from "../models/Comment";
import * as message from "../libs/statusResponse";
import { ExceptionHandler, handleException } from "../libs/ExceptionHandler";

export const createComment = async (req, res, next) => {
  const { textComment } = req.body;

  const userComment = req.userId;

  try {
    const newComment = new Comment({ textComment, userComment });
    const session = req.session;
    const commentSaved = await newComment.save({ session });

    if (!commentSaved)
      return res.status(403).json({ message: "Error creating comment" });

    req.commentId = commentSaved._id;

    next();
  } catch (exception) {
    return handleException(req, res, exception);
  }
};

export const getComment = async (req, res) => {
  try {
    const comments = await Comment.find().populate("userComment");

    res.json(comments);
  } catch (exception) {
    return handleException(req, res, exception);
  }
};

export const getCommentById = async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const comment = await Comment.findById(commentId).populate("userComment");

    res.status(200).json(comment);
  } catch (exception) {
    return handleException(req, res, exception);
  }
};

export const getCommentsByPodcast = async (req, res) => {
  const { podcastId, page } = req.params;
  const pageElements = 5;
  const startIndex = page * pageElements - pageElements;
  try {
    // const comments = await Comment.find().populate("userComment")
    const comments = await Comment.aggregate([
      {
        $lookup: {
          from: "podcasts",
          localField: "_id",
          foreignField: "commentsPodcast",
          as: "podcastId",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userComment",
          foreignField: "_id",
          as: "userComment",
        },
      },
      {
        $unwind: "$userComment",
      },
      {
        $set: {
          podcastId: { $arrayElemAt: ["$podcastId._id", 0] },
        },
      },
      {
        $match: { podcastId: mongoose.Types.ObjectId(podcastId) },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])
      .skip(startIndex)
      .limit(pageElements);

    res.json(comments);
  } catch (exception) {
    return handleException(req, res, exception);
  }
};

export const updateCommentById = async (req, res) => {
  const { commentId } = req.params;
  const commentInfo = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      commentInfo,
      { returnOriginal: false }
    );

    if (message.responseDebug) {
      res.status(200).json(updatedComment);
    } else res.status(200).json({ status: message.statusResponse.SUCCESS });
  } catch (exception) {
    return handleException(req, res, exception);
  }
};

export const deleteCommentById = async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await Comment.findByIdAndUpdate(
      commentId,
      { deletedAt: new Date(Date.now()).toISOString() },
      { returnOriginal: false }
    );

    if (message.responseDebug) {
      res.status(204).json(deletedComment);
    } else res.status(204).json({ status: message.statusResponse.SUCCESS });
  } catch (exception) {
    return handleException(req, res, exception);
  }
};
