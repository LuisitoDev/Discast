import * as Privacy from "../models/Privacy"
import * as State from "../models/State"


const createPrivacy = async () => {
    const count = await Privacy.default.estimatedDocumentCount()

    try{
        if (count > 0) return

        const values = await Promise.all([
            new Privacy.default({name: Privacy.privacyTypes.PUBLIC}).save(),
            new Privacy.default({name: Privacy.privacyTypes.ONLY_FRIENDS}).save(),
            new Privacy.default({name: Privacy.privacyTypes.ONLY_ME}).save()
        ])

        console.log(values)    
    }
    catch (error){
        console.log(error)
    }

}



export const createState = async () => {
    const count = await State.default.estimatedDocumentCount()

    try{
        if (count > 0) return
        
        const values = await Promise.all([
            new State.default({name: State.stateTypes.OPEN}).save(),
            new State.default({name: State.stateTypes.PAUSED}).save(),
            new State.default({name: State.stateTypes.CLOSED}).save()
        ])

        console.log(values)    
    }
    catch (error){
        console.log(error)
    }

}

export const initSetup = async () => {
    createPrivacy()
    createState()
}

