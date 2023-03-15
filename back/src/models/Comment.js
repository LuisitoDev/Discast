import { Schema, model } from "mongoose"

const commentSchema = new Schema({
    textComment: {
        type: String,
        required: true
    },
    userComment: {
        ref: "User",
        type: Schema.Types.ObjectId
    },
    editedComment: {
        type: Boolean,
        default: false,
        required: true

    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Comment", commentSchema)