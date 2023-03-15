import React, { useRef , useState, useContext, useEffect } from 'react';
import AuthContext from "../../Utils/auth-context";
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import ProfilePopup from '../../UI/Popup/Popup';
import moment from 'moment'
import 'moment/locale/es-mx'

import "./AudioTimelineCard.css";
import '../../UI/AudioRecorder/audio-player.css';
import { AnimatePresence, motion } from 'framer-motion';
import {addElementToStateArray, removeElementFromStateArray} from '../../Utils/manipulate-state-arrays';
import * as ClipResponseService from '../../../services/clip_response.service';
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

const AudioTimelineCard = (props) => {    
    moment.locale('es-mx')
    const isInitialMount = useRef(true);

    const {clipResponse} = props
    const authContext = useContext(AuthContext);
    
    const [userVote, setUserVote] = useState(false)
    const [usersLikesClipResponse, setUsersLikesClipResponse] = useState([])
    const loggedUserId = useRef(null)

    const SRC = `https://programacion-web-2.herokuapp.com/api/file/${clipResponse.soundFileClipResponse}`

    useEffect(()=> {

        if (isInitialMount.current) {
            window.scrollTo(0,0)

            setUsersLikesClipResponse(clipResponse?.usersLikesClipResponse)

            isInitialMount.current = false;
        }
        
        const isLoggedIn = authContext.isLoggedIn();
        const userInfo = authContext.userInfo;

        if (isLoggedIn !== null && userInfo !== null){

            loggedUserId.current = authContext.userInfo._id;
                        
            if (loggedUserId.current !== undefined){
                if (usersLikesClipResponse.includes(loggedUserId.current)){
                    setUserVote(true)
                }
                else {
                    setUserVote(false)
                }
            }       
        }

        return () => console.log('se quito el timeline')
        }, [authContext, usersLikesClipResponse])
      

    const audioHandler = (e) => {
        switch(e.type){
            case 'play':
                props.onPlay(e, SRC, props.index)
                break
            case 'ended':
                props.onEnded(e, SRC, props.index)
                break
            case 'pause':
                props.onPause(e, SRC, props.index)
                break
            case 'timeupdate':
                props.onListen(e, SRC, props.index)
        }
    }

    const voteHandler = () => {
        debugger;
        if (!authContext.isLoggedIn())
            return;

        const usersLikesClipResponseBefore = usersLikesClipResponse
  
        if (!usersLikesClipResponse.includes(loggedUserId.current)){
            addElementToStateArray(usersLikesClipResponse, setUsersLikesClipResponse, loggedUserId.current)
        }
        else {
            removeElementFromStateArray(usersLikesClipResponse, setUsersLikesClipResponse, loggedUserId.current)
        }

        ClipResponseService.voteClipResponse(authContext.getAuthHeader(), clipResponse._id).then(result => {
            if(!result || result.status !== 'SUCCESS') {
                //Cancelamos el like
                setUsersLikesClipResponse(usersLikesClipResponseBefore);
            }
        })
    }
  

    return (
        <AnimatePresence>
            <motion.div
            initial={{
                x: -100,
                opacity: 0,
            }}
            animate={{
                x: 0,
                transition: {
                    duration: 0.3,
                },
                opacity: 1,
            }}>
                <div className="row mx-3">
                    {props.isAnswer && 
                        <React.Fragment>
                            <div className="col-1 p-0 d-flex justify-content-end">
                                <div className="v2 flex-grow"></div>
                            </div>
                            <div className="col-1 p-0 d-flex align-items-center">
                                <div className="h1"></div>
                            </div>
                        </React.Fragment>
                    }
                    
                    <div className="col-2 d-flex flex-column align-items-center justify-content-center">
                        {!props.isAnswer && <div className="vl flex-grow-1"></div>}

                        <ProfilePopup user={clipResponse.userClipResponse}>
                            {<img src={clipResponse.userClipResponse.imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${clipResponse.userClipResponse.imageFileUser}`) : AvatarPlaceholder} alt="userImage" 
                            className={`${clipResponse.userClipResponse.imageFileUser ? "profileImage" : "profileImagePlaceholder"} img-fluid img-thumbnail`} />}
                        </ProfilePopup>
                        
                        {!props.isAnswer && <div className="vl flex-grow-1"></div>}
                    </div>

                    <div className={`${props.isAnswer ? 'col-8' : 'col-10'} p-3 border border-3 border-primary my-4 audio-player`} style={{
                        borderRadius: "10px",
                        transition: "all ease-in-out .3s"
                    }}>
                        <div className="row mb-2 w-100">
                            <div className="col-12 d-flex justify-content-between">
                                <h5 className='fw-bold'>{`${clipResponse.userClipResponse.nameUser} ${clipResponse.userClipResponse.apPaternoUser}`}</h5>
                                <span>{moment(clipResponse.createdAt).fromNow()}</span>
                            </div>
                        </div>

                        <AudioPlayer ref={props.innerRef} src={SRC} onPlay={audioHandler} onEnded={audioHandler} onPause={audioHandler} onListen={audioHandler}
                        customIcons={{rewind: <i className="rewind fas fa-redo"></i> , forward: <i className="forward fas fa-redo"></i> }} showDownloadProgress={false} customAdditionalControls={[]}
                        listenInterval={props.listenInterval}
                        customProgressBarSection={
                            [
                                RHAP_UI.MAIN_CONTROLS,
                                <div className='ms-2'></div>,
                                RHAP_UI.CURRENT_TIME,
                                <div>/</div>,
                                RHAP_UI.DURATION,
                                RHAP_UI.PROGRESS_BAR,
                            
                                RHAP_UI.VOLUME,
                                
                                <span className="ms-3 me-2"><i className={`${userVote === true ? `fas fa-solid fa-heart` : `fa-regular fa-heart`}`} onClick={() => {voteHandler()}}></i> {usersLikesClipResponse.length} </span>
                            ]
                        }
                        customControlsSection={[]}
                        customVolumeControls={[]}
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}   

export default AudioTimelineCard;