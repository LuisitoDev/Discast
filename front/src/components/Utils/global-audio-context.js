import React, {useState, useEffect, useRef} from 'react'
import * as PodcastService from '../../services/podcast.service'

const GlobalAudioContext = React.createContext({
    podcastPlaying: null,
    currentAudio: null,
    currentTime: null,
    isPlaying: null,
    isEnded: null,
    isBack: null,
    isMountedRef: null,
    setPodcast: ()=>{},
    normalState: ()=> {},
    setIsPlaying: ()=>{},
    next: () =>{},
    pause: () => {},
    play: () => {},
    ended: () => {},
    disable: () =>{}
})

export const GlobalAudioContextProvider = (props)=>{
    const [podcastPlaying, setPodcastPlaying] = useState(null)
    const [currentAudio, setCurrentAudio] = useState(null)
    const [currentTime, setCurrentTime] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isEnded, setIsEnded] = useState(null)
    const [isBack, setIsBack] = useState(null)

    const isMountedRef = useRef(false)

    const setPodcast = (podcast, currentAudioP = null, currentTimeP = null, isViewed = false) => {
        if(!isViewed)
            isMountedRef.current = true
        else 
            isMountedRef.current = false
        // THIS IS GONNA BE INVOKE WHEN YOU PLAY THE PODCAST FOR THE FIRST TIME
        console.log('me reproduzco en global como podcast nuevo')
        if(currentAudio === null){
            setCurrentAudio(0)
        }

        
        // This occurs when is coming from timeline sync
        if(currentAudioP !== null && currentTimeP !== null) {
            setCurrentAudio(currentAudioP)
            setCurrentTime(currentTimeP)
            setIsBack(true)
        }

        setIsEnded(false)    
        setPodcastPlaying(podcast)

    }


    

    const normalState = () => {
        setIsBack(false)
    }

    const next = () => {
        if(currentAudio + 1 < podcastPlaying?.clipResponsesPodcast.length){
            if(isMountedRef.current){
                isMountedRef.current = false
                // TODO: View to server with endpoint
                PodcastService.updateViewsToPodcast(podcastPlaying?._id)
            }
            setCurrentAudio(old => old + 1)
        } else {
            setCurrentAudio(0)
            setIsPlaying(false)
            setIsEnded(true)
            if(isMountedRef.current){
                PodcastService.updateViewsToPodcast(podcastPlaying?._id)
            }
            isMountedRef.current = true
            console.log('ya se termino el podcast playlist')
        }
    }

    const pause = () => {
        if(isPlaying && !isEnded)
            setIsPlaying(false)

    }

    const play = () => {
        if(!isPlaying && !isEnded)
            setIsPlaying(true)
    }

    const disable = () => {
        setCurrentAudio(null)
        setPodcastPlaying(null)
        setIsPlaying(null)
        setIsEnded(null)
        setIsBack(null)
    }

    const ended = () => {
        setIsEnded(false)
    }

    return <GlobalAudioContext.Provider value={{
        podcastPlaying,
        currentAudio,
        currentTime,
        isPlaying,
        isEnded,
        isBack,
        isMountedRef,
        setPodcast,
        normalState,
        setIsPlaying,
        next,
        pause,
        play,
        ended,
        disable
    }}>
        {props.children}
    </GlobalAudioContext.Provider>
}

export default GlobalAudioContext