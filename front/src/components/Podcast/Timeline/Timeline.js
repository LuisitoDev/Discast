import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import AudioTimelineCard from '../AudioTimelineCard/AudioTimelineCard';
import HeaderPodcast from '../HeaderPodcast/HeaderPodcast';
import GlobalAudioContext from '../../Utils/global-audio-context';
import * as PodcastService from '../../../services/podcast.service'
import * as ClipResponseService from '../../../services/clip_response.service'
import useInfiniteScroll from '../../Utils/useInfiniteScroll';
import {focusEnum} from "../FocusEnum"

const Timeline = (props) => {
    // const [clipResponses, setClipResponses] = useState([])
    const [page, setPage] = useState(2)

    // const [podcast, setPodcast] = useState(null)
    const podcastRef = useRef()
    // LOADING FLAGS
    const [isLoadingResponses, setIsLoadingResponses] = useState(true)
    // const [isLoadingPodcast, setIsLoadingPodcast] = useState(true)
    
    // AUDIO PLAYER
    const audioRefs = useRef([])
    
    
    const [isPlaying, setIsPlaying] = useState(false)
    const isPlayingRef = useRef()

    const [currentAudio, setCurrentAudio] = useState(null)
    const currentAudioRef = useRef()

    const [currentTime, setCurrentTime] = useState(null)
    const currentTimeRef = useRef()

    const globalAudioContext = useContext(GlobalAudioContext)
    const globalAudioRef = useRef()
    // GETTING DATA FROM API
    
    const remountedRef = useRef(false)
    const {podcastId} = useParams()


    
    // const podcastError = useCallback(props.error, [])

    useEffect(()=> {
        window.scrollTo(0,0)
        
        setIsPlaying(false)
        setCurrentAudio(null)
        setCurrentTime(null)
        // setIsLoadingPodcast(true)
        setPage(2)
        audioRefs.current = []

        /* PodcastService.getPodcastById(podcastId).then(result => {
            if(result.status === 'ERROR') podcastError()
            setPodcast(result)
            setIsLoadingPodcast(false)
        }) */

        ClipResponseService.getClipResponsesByPodcast(podcastId, 1).then(result => {
            props.setClipResponses(result)
        })
        
        if(!remountedRef.current){
            remountedRef.current = true;
        }

       
       
    }, [podcastId])


    // CHANGE FOCUS USE EFFECT
    
    useEffect(()=>{
        if (props.focusOn !== focusEnum.TIMELINE && isPlaying === true){
            audioRefs.current[currentAudio]?.audio.current.pause();
        }
    }, [props.focusOn])

    // Get the last values of all necesaries states
    useEffect(()=> {
        currentTimeRef.current = currentTime
        currentAudioRef.current = currentAudio
        podcastRef.current = props.podcast
        globalAudioRef.current = globalAudioContext
        isPlayingRef.current = isPlaying
    }, [currentTime, currentAudio, props.podcast, globalAudioContext, isPlaying])


    const passToGlobalAudio = useCallback(() => {
        if(isPlaying) {
            globalAudioContext.setPodcast(props.podcast, currentAudio, audioRefs.current[currentAudio].audio.current.currentTime, !remountedRef.current)
            
            audioRefs.current[currentAudio].container.current.parentNode.classList.remove('active')
            audioRefs.current[currentAudio].audio.current.pause();
            audioRefs.current[currentAudio].audio.current.currentTime = 0;
            
            if(audioRefs.current[currentAudio].container.current.parentNode.previousElementSibling.childNodes[1])
                audioRefs.current[currentAudio].container.current.parentNode.previousElementSibling.childNodes[1].classList.remove('active')
            else 
                audioRefs.current[currentAudio].container.current.parentNode.previousElementSibling.childNodes[0].classList.remove('active')   

        } else {
            globalAudioContext.setPodcast(props.podcast)
        }
    }, [isPlaying, globalAudioContext,props.podcast,currentAudio])

//    Unmount function
    useEffect(()=>()=>{
        if(isPlayingRef.current)
            globalAudioRef.current.setPodcast(podcastRef.current, currentAudioRef.current, currentTimeRef.current)
    }, [])

    // AUDIO PLAYER LOGIC BEGIN
    const addToRefs = (el) => {
        if(el && !audioRefs.current.includes(el))
            audioRefs.current.push(el)
        
    }



    const playAudioHandler = (e, src, index) => {
        console.log('le diste play a ', index)
        globalAudioContext.disable()
        if(currentAudio != null && index !== currentAudio){
            console.log('le voy a poner stop', currentAudio)
            audioRefs.current[currentAudio].audio.current.pause();
            audioRefs.current[currentAudio].audio.current.currentTime = 0;
            audioRefs.current[currentAudio].container.current.parentNode.classList.remove('active')
       
            if(audioRefs.current[currentAudio].container.current.parentNode.previousElementSibling.childNodes[1])
                audioRefs.current[currentAudio].container.current.parentNode.previousElementSibling.childNodes[1].classList.remove('active')
            else 
                audioRefs.current[currentAudio].container.current.parentNode.previousElementSibling.childNodes[0].classList.remove('active')


        }
        
        setCurrentAudio(index);
        setIsPlaying(true)
        audioRefs.current[index].container.current.parentNode.scrollIntoView({block: 'nearest', behavior: 'smooth'})

        audioRefs.current[index].container.current.parentNode.classList.add('active')


        if(audioRefs.current[index].container.current.parentNode.previousElementSibling.childNodes[1])
            audioRefs.current[index].container.current.parentNode.previousElementSibling.childNodes[1].classList.add('active')            
        else
            audioRefs.current[index].container.current.parentNode.previousElementSibling.childNodes[0].classList.add('active')
        
        props.setFocusOn(focusEnum.TIMELINE)
        // containerClipRef.current.scrollTop = audioRefs.current[index].container.current.parentNode.offsetTop - containerClipRef.current.offsetTop
        // window.scrollTo(0, audioRefs.current[index].container.offsetTop)
        // audioRefs.current[index].container.scrollIntoView({ behavior: 'smooth' });
    }
    
    const endAudioHandler = (e, src, index) => {
        if(remountedRef.current){
            // CALL VIEW ENDPOINT
            console.log('voy a actualizar las views')
            PodcastService.updateViewsToPodcast(podcastId)
            remountedRef.current=false;
        }

        if(index + 1 < audioRefs.current.length){
            audioRefs.current[index+1].audio.current.currentTime = 0;
            audioRefs.current[index+1].audio.current.play()
            return;
        }
        setIsPlaying(false)

        audioRefs.current[index].container.current.parentNode.classList.remove('active')
          if(audioRefs.current[index].container.current.parentNode.previousElementSibling.childNodes[1])
            audioRefs.current[index].container.current.parentNode.previousElementSibling.childNodes[1].classList.remove('active')            
        else
            audioRefs.current[index].container.current.parentNode.previousElementSibling.childNodes[0].classList.remove('active')

    }

    const pauseAudioHandler = (e, src, index) => {
        if(index === currentAudio)
            setIsPlaying(false)
    }

    const listenAudioHandler = (e, src, index) => {
        if(index === currentAudio)
            setCurrentTime(e.target.currentTime)
    }

    const togglePlayHeaderHandler = () => {
        if(!isPlaying && currentAudio === null){
            audioRefs.current[0].audio.current.play()
        }

        if(!isPlaying && currentAudio !== null) {
            audioRefs.current[currentAudio].audio.current.play()
        }

        if(isPlaying) {
            audioRefs.current[currentAudio].audio.current.pause()
        }
    }
    // AUDIO PLAYER LOGIC END
    
    const moreClipRespones = () => {
    //    console.log(clipResponses)
        if(props.clipResponses.length % 5 === 0) { //TODO: Ya le meti un hotfix pero le falta optimizar porque si son 5 responses entonces hace varias peticiones, no tantas como antes.
            ClipResponseService.getClipResponsesByPodcast(podcastId, page).then(result => {
                props.setClipResponses(oldClipResponses => {
                    return [... new Set([...oldClipResponses, ...result])]
                })
                setPage(page => page+1)
                setIsFetching(false)
            })
        } 
            

        
    }

    const responsesContainerRef = useRef(null)

    const [isFetching, setIsFetching] = useInfiniteScroll(moreClipRespones, responsesContainerRef)
  
    return (
        <React.Fragment>
            <HeaderPodcast isPlaying={isPlaying} onTogglePlay={togglePlayHeaderHandler} podcast={props.podcast} passToGlobalAudio={passToGlobalAudio} 
            clipResponses={props.clipResponses} setClipResponses={props.setClipResponses}
            clipRequests={props.clipRequests}  setClipRequests={props.setClipRequests}
            scrolldivTimelineRef={props.scrolldivTimelineRef}
            scrolldivInboxRef={props.scrolldivInboxRef}/>
            {/* <div className="row border-2 border-bottom border-primary mb-3 d-flex align-items-center" >
                
            </div> */}
            {/* TODO: Make it scrollable by putting max-height */}
            <div className="row" style={{maxHeight: "70vh", overflowY: "scroll"}} ref={responsesContainerRef}>
                <div
                    className="col-11 mx-auto  border-3 border-primary pt-4 timeline-background"
                >
                    {props.isLoadingPodcast && 
                    <div className="text-center" >
                        <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    {!props.isLoadingPodcast && 
                        props.clipResponses.map((clipResponse, index) => 
                        <AudioTimelineCard isAnswer={!(props.podcast.authorPodcast._id === clipResponse.userClipResponse._id)}
                                            clipResponse={clipResponse} 
                                            key={clipResponse._id}
                                            innerRef={addToRefs} 
                                            onPlay={playAudioHandler} 
                                            onEnded={endAudioHandler}
                                            onPause={pauseAudioHandler}
                                            onListen={listenAudioHandler}
                                            listenInterval={1}
                                            index={index}
                                            />)}
                    <div ref={props.scrolldivTimelineRef}></div>
                </div>
            </div>
        </React.Fragment>

    );
}

export default Timeline;