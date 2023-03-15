import React, {useEffect, useState, useRef, useContext} from 'react';
import AudioInboxCard from './AudioInboxCard';
import GlobalAudioContext from '../../Utils/global-audio-context';
import AuthContext from "../../Utils/auth-context";
import { useParams } from 'react-router-dom';
import * as ClipRequestService from '../../../services/clip_request.service';
import * as UserService from '../../../services/user.service';
import {focusEnum} from "../FocusEnum"
import useInfiniteScroll from '../../Utils/useInfiniteScroll';

const Inbox = (props) => {
    const authContext = useContext(AuthContext);

    // const [clipRequests, setClipRequest] = useState([])
    const [page, setPage] = useState(2)
    
    // LOADING FLAGS
    const [isLoadingResquest, setIsLoadingRequest] = useState(true)
    
    // AUDIO PLAYER
    const audioRefs = useRef([])
    const containerClipRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentAudio, setCurrentAudio] = useState(null)
    const globalAudioContext = useContext(GlobalAudioContext)

    //USER INFO
    const loggedUserId = useRef(null);
    const [isUserInfoLoaded, setIsUserInfoLoaded] = useState(null)

    // GETTING DATA FROM API
    const {podcastId} = useParams()
    useEffect(()=> {
        window.scrollTo(0,0)
            
        ClipRequestService.getClipRequestByPodcast(podcastId, 1).then(result => {
            console.log(result)
            props.setClipRequests(result)
            setIsLoadingRequest(false)
            console.log("entro aquí");
        })

        setPage(2)

    }, [podcastId])

    useEffect(()=> {

        const userInfo = authContext.userInfo;
 
        if(userInfo !== null){
            loggedUserId.current = authContext.userInfo._id;
            setIsUserInfoLoaded(true);
        }

    }, [authContext, isUserInfoLoaded])


    
    // CHANGE FOCUS USE EFFECT
    
    useEffect(()=>{
        
        if (props.focusOn !== focusEnum.INBOX && isPlaying === true){
            audioRefs.current[currentAudio]?.audio.current.pause();
        }
    }, [props.focusOn])

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
        }
        
        setCurrentAudio(index);
        setIsPlaying(true)
        audioRefs.current[index].container.current.parentNode.scrollIntoView({block: 'nearest', behavior: 'smooth'})
        
        props.setFocusOn(focusEnum.INBOX)
        // containerClipRef.current.scrollTop = audioRefs.current[index].container.current.parentNode.offsetTop - containerClipRef.current.offsetTop
        // window.scrollTo(0, audioRefs.current[index].container.offsetTop)
        // audioRefs.current[index].container.scrollIntoView({ behavior: 'smooth' });
    }
    
    const endAudioHandler = (e, src, index) => {
        // if(index + 1 < audioRefs.current.length){
        //     audioRefs.current[index+1].audio.current.currentTime = 0;
        //     audioRefs.current[index+1].audio.current.play()
        //     return;
        // }
        setIsPlaying(false)
    }

    const pauseAudioHandler = (e, src, index) => {
        if(index === currentAudio)
            setIsPlaying(false)
    }


    // AUDIO PLAYER LOGIC END


    const moreClipRequests = () => {

        if(props.clipRequests.length % 5 === 0)

        ClipRequestService.getClipRequestByPodcast(podcastId, page).then(result => {
            props.setClipRequests(oldClipRequest => {
                return [...new Set([...oldClipRequest, ...result])]
            })
        
            setPage(page => page+1)
            setIsFetching(false)
        })
    }

    const [isFetching, setIsFetching] = useInfiniteScroll(moreClipRequests, containerClipRef);
   

    return (
        <React.Fragment>
            <div className="border-start border-2 border-end-0 p-4 sticky-top border-primary" style={{
                            overflowY: "scroll",
                            maxHeight: "80vh",
                            height: "80vh" 
                        }}
                        ref={containerClipRef}>
                <h1 className="text-center display-3 fw-light mb-4">Inbox</h1>
                
                {isLoadingResquest && props.isLoadingPodcast &&
                        <div className="text-center" >
                            <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>}
                {!isLoadingResquest && props.clipRequests.length !== 0 && !props.isLoadingPodcast &&
                    props.clipRequests.map((clipRequest, index) => 
                        <AudioInboxCard 
                            isPodcastOwner={ props.podcast.authorPodcast._id === loggedUserId.current }
                            podcast={props.podcast}
                            clipResponses={props.clipResponses}
                            setClipResponses={props.setClipResponses}
                            clipRequests={props.clipRequests}
                            setClipRequests={props.setClipRequests}
                            clipRequest={clipRequest}
                            key={clipRequest._id}
                            innerRef={addToRefs} 
                            scrolldivTimelineRef={props.scrolldivTimelineRef}
                            onPlay={playAudioHandler} 
                            onEnded={endAudioHandler}
                            onPause={pauseAudioHandler}
                            index={index}
                        />)
                        }
                {!isLoadingResquest && props.clipRequests.length === 0 &&
                    <div className="text-center p-3" style={{borderRadius: "1em"}}>
                        <span className='d-block text-primary mb-3'><i className="fas fa-microphone-alt-slash fa-6x"></i></span>
                        <p className="text-center fs-4 fw-light">No se encontraron Solicitudes de Clip.</p>
                    </div>
                        }
                <div ref={props.scrolldivInboxRef}></div>
            </div>
        </React.Fragment>
    );
}

export default Inbox;