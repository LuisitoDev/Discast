import { Schema, model } from "mongoose"

const clipResponseSchema = new Schema({
    userClipResponse: {
        ref: "User",
        type: Schema.Types.ObjectId
    },
    soundFileClipResponse: {
        ref: "uploads.files",
        type: Schema.Types.ObjectId
    },
    usersLikesClipResponse: [{
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

export default model("Clip_Response", clipResponseSchema)