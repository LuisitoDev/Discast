import { Schema, model } from "mongoose"

const clipRequestSchema = new Schema({
    titleClipRequest: {
        type: String,
        required: true
    },
    secondStartPreviewClipRequest: {
        type: String,
        required: true
    },
    secondEndPreviewClipRequest: {
        type: String,
        required: true
    },
    soundFileClipRequest: {
        ref: "uploads.files",
        type: Schema.Types.ObjectId
    },
    userClipRequest: {
        ref: "User",
        type: Schema.Types.ObjectId
    },
    usersLikesClipRequest: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    usersDislikesClipRequest: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Clip_Request", clipRequestSchema)