import {Schema, model} from "mongoose"

const podcastSchema = new Schema({
    titlePodcast: {
        type: String,
        required: true
    },
    privacyPodcast: {
        ref: "Privacy",
        type: Schema.Types.ObjectId
    },
    viewsNumberPodcast: {
        type: Number,
        default: 0,
        required: true
    },
    durationPodcast: {
        type: Schema.Types.Decimal128,
        default: 0.0,
        required: true
    },
    authorPodcast: {
        ref: "User",
        type: Schema.Types.ObjectId
    },
    imageFilePodcast: {
        ref: "uploads.files",
        type: Schema.Types.ObjectId
    },
    secondStartPreviewPodcast: {
        type: String,
        required: true
    },
    secondEndPreviewPodcast: {
        type: String,
        required: true
    },
    clipResponsesPodcast: [{
        ref: "Clip_Response",
        type: Schema.Types.ObjectId
    }],
    clipRequestPodcast: [{
        ref: "Clip_Request",
        type: Schema.Types.ObjectId
    }],
    commentsPodcast: [{
        ref: "Comment",
        type: Schema.Types.ObjectId
    }],
    usersLikesPodcast: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    statePodcast: {
        ref: "State",
        type: Schema.Types.ObjectId
    },
    deletedAt: {
        type: Date
    }
    
},
{
    timestamps: true,
    versionKey: false
})

export default model("Podcast", podcastSchema)