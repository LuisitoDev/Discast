import {Schema, model} from "mongoose"
import bcrypt from "bcryptjs"

const authSchema = new Schema({
    emailUserAuth: {
        type: String,
        unique: true
    },
    passwordUserAuth: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
})

authSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

authSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}

export default model("Auth", authSchema)