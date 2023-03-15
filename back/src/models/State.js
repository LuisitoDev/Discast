import {Schema, model} from "mongoose"

export const stateTypes = {
    OPEN: 'open',
    PAUSED: 'paused',
    CLOSED: 'closed'
}

Object.freeze(stateTypes)

const stateSchema = new Schema({
    name: String
},
{
    versionKey: false
})

export default model ("State", stateSchema)