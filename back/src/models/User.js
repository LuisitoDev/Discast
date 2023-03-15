import {Schema, model} from "mongoose"

const userSchema = new Schema({
    emailUser: {
        ref: "Auth",
        type: Schema.Types.ObjectId
    },
    nameUser: {
        type: String,
        required: true
    },
    apPaternoUser: {
        type: String,
        required: true
    },
    apMaternoUser: {
        type: String,
        required: true
    },
    imageFileUser: {
        ref: "uploads.files",
        type: Schema.Types.ObjectId
    },
    followersUser: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    followingUser: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    friendRequestsUser: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    friendsUser: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }]
},
{
    timestamps: true,
    versionKey: false
})

export default model("User", userSchema)