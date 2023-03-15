import {Schema, model} from "mongoose"

export const privacyTypes = {
    PUBLIC: 'public',
    ONLY_FRIENDS: 'only_friends',
    ONLY_ME: 'only_me'
}

Object.freeze(privacyTypes)

const privacySchema = new Schema({
    name: String
},
{
    versionKey: false
})

export default model ("Privacy", privacySchema)