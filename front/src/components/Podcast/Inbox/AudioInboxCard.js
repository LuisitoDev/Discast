import React, {useEffect, useState, useRef, useContext} from 'react';
import AuthContext from "../../Utils/auth-context";
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import ProfilePopup from '../../UI/Popup/Popup';
import moment from 'moment'
import * as ClipRequestService from '../../../services/clip_request.service';
import * as PodcastService from '../../../services/podcast.service';
import { AnimatePresence, motion } from "framer-motion";

import {addElementToStateArray, removeElementFromStateArray} from '../../Utils/manipulate-state-arrays'
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

import '../../UI/AudioRecorder/audio-player.css';
import './InboxAudioPlayer.css';

const AudioInboxCard = (props) => {
  const authContext = useContext(AuthContext);
  const isInitialMount = useRef(true);

  moment.locale('es-mx')

  const {clipRequest} = props
  const loggedUserId = useRef(null)
  
  const [userVote, setUserVote] = useState(null)
  const [usersLikesClipRequest, setUsersLikesClipRequest] = useState([])
  const [isClipRequestVisible, setIsClipRequestVisible] = useState(true);
  const [usersDislikesClipRequest, setUsersDislikesClipRequest] = useState([])

  const SRC = `https://programacion-web-2.herokuapp.com/api/file/${clipRequest.soundFileClipRequest}`

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

      }
  }

  useEffect(()=> {

    // console.log(props);
    
      if (isInitialMount.current) {

        // console.log(props)  
        window.scrollTo(0,0)

        setUsersLikesClipRequest(clipRequest?.usersLikesClipRequest)
        setUsersDislikesClipRequest(clipRequest?.usersDislikesClipRequest)

        isInitialMount.current = false;
      }
      
      const isLoggedIn = authContext.isLoggedIn();
      const userInfo = authContext.userInfo;

      if (isLoggedIn !== null && userInfo !== null){

          loggedUserId.current = authContext.userInfo._id;
          // setUserLoggedIn(isLoggedIn);
          
          if (loggedUserId.current !== undefined){
            if (usersLikesClipRequest.includes(loggedUserId.current)){
              setUserVote(true)
            }
            else if (usersDislikesClipRequest.includes(loggedUserId.current)){
              setUserVote(false)
            }
            else {
              setUserVote(null)
            }
          }            
      }

      return () => console.log('se quito el timeline')
    }, [authContext, usersLikesClipRequest, usersDislikesClipRequest])
  

  // const [isAudioPlayerShowing, setIsAudioPlayerShowing] = useState(false);

  // const switchAudioPlayerVisibility = () => {
  //   setIsAudioPlayerShowing(!isAudioPlayerShowing);
  // }

    const voteHandler = (voteClip) => {

      if (!authContext.isLoggedIn())
        return;

      const usersLikesClipRequestBefore = usersLikesClipRequest
      const usersDislikesClipRequestBefore = usersDislikesClipRequest

      if (voteClip === 1){
        if (!usersLikesClipRequest.includes(loggedUserId.current)){
          addElementToStateArray(usersLikesClipRequest, setUsersLikesClipRequest, loggedUserId.current)

          if (usersDislikesClipRequest.includes(loggedUserId.current)){
            removeElementFromStateArray(usersDislikesClipRequest, setUsersDislikesClipRequest, loggedUserId.current)
          }
        }
        else {
          removeElementFromStateArray(usersLikesClipRequest, setUsersLikesClipRequest, loggedUserId.current)
        }
      }
      else if (voteClip === 0){
        if (!usersDislikesClipRequest.includes(loggedUserId.current)){
          addElementToStateArray(usersDislikesClipRequest, setUsersDislikesClipRequest, loggedUserId.current)

          if (usersLikesClipRequest.includes(loggedUserId.current)){
            removeElementFromStateArray(usersLikesClipRequest, setUsersLikesClipRequest, loggedUserId.current)
          }
        }
        else {
          removeElementFromStateArray(usersDislikesClipRequest, setUsersDislikesClipRequest, loggedUserId.current)
        }
      }

      ClipRequestService.voteClipRequest(authContext.getAuthHeader(), clipRequest._id, voteClip).then(result => {
        if(!result || result.status !== 'SUCCESS') {
            //Cancelamos el like/dislike

            setUsersLikesClipRequest(usersLikesClipRequestBefore)
            setUsersDislikesClipRequest(usersDislikesClipRequestBefore)
          
        }
      })
    }

    const clipRequestToResponseHandler = () => {

      const clipRequestsBefore = props.clipRequests;
      setIsClipRequestVisible(false);

      PodcastService.ConvertClipRequestToResponse(props.podcast._id, authContext.getAuthHeader(), clipRequest._id).then(result => {
        
        if(result && result.status === 'SUCCESS') {
          removeElementFromStateArray(props.clipRequests, props.setClipRequests, props.clipRequest);
          addElementToStateArray(props.clipResponses, props.setClipResponses, result.clipResponse);
          props.scrolldivTimelineRef.current.focus();
          props.scrolldivTimelineRef.current.scrollIntoView({ behavior: "smooth" });
        
        } 
        else {
          // props.setClipRequests(clipRequestsBefore)
          setIsClipRequestVisible(true);
        }

      }).catch( error => {
        console.log(error);
      })
    }

    const deleteClipRequestHandler = () => {

      const clipRequestsBefore = props.clipRequests;
      setIsClipRequestVisible(false);
      
      if(props.isPodcastOwner){
        ClipRequestService.deleteClipRequestByPodcastOwner(authContext.getAuthHeader(), clipRequest._id, props.podcast._id).then(result =>{
          if(result && result.status === 'SUCCESS'){
            removeElementFromStateArray(props.clipRequests, props.setClipRequests, props.clipRequest);
          } else {
            setIsClipRequestVisible(true);
            // props.setClipRequests(clipRequestsBefore)
          }
          // if(!result || result.status !== 'SUCCESS') {
          // props.setClipRequests(clipRequestsBefore)
          // }

        }).catch( error => {
          console.log(error);
        })
      } else if(loggedUserId.current === clipRequest.userClipRequest._id) {
        ClipRequestService.deleteClipRequestByClipOwner(authContext.getAuthHeader(), clipRequest._id).then(result => {

          if(result && result.status === 'SUCCESS'){
            removeElementFromStateArray(props.clipRequests, props.setClipRequests, props.clipRequest);
          } else {
            setIsClipRequestVisible(true);
            // props.setClipRequests(clipRequestsBefore)
          }

          // if(!result || result.status !== 'SUCCESS') {
          //   props.setClipRequests(clipRequestsBefore)
          // }
          
        }).catch( error => {
          console.log(error);
        })
      }

    }

    return (
      <AnimatePresence>
        {isClipRequestVisible && 
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
          }}
          exit={{
            x: -100,
            opacity: 0,
            transition: {duration: 0.3}
          }}>
            <div className="row mb-3 py-3 border-bottom border-1 border-primary">
              <div className="col-3" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start"
              }}> 
                <ProfilePopup user={clipRequest?.userClipRequest}>
                  {<img src={clipRequest?.userClipRequest.imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${clipRequest?.userClipRequest.imageFileUser}`) : AvatarPlaceholder} alt="userImage"
                  className={`${clipRequest?.userClipRequest.imageFileUser ? "profileInboxImage" : "profileInboxImagePlaceholder"} img-fluid img-thumbnail`} />}
                </ProfilePopup>
              </div>
              <div className="inboxAudioContainer col-9 d-flex p-0" 
              // onClick={switchAudioPlayerVisibility}
              >
                {/* <AudioPlayer ref={props.innerRef} src={SRC} onPlay={audioHandler} onEnded={audioHandler} onPause={audioHandler} layout='stacked-reverse' customVolumeControls={[]} 
                customAdditionalControls={[]} showJumpControls={false} customProgressBarSection={[]} /> */}
                {/* <i className="fas fa-play fs-2 me-2"></i> */}
                <div className='w-100'>
                  <p className='fw-bold'>
                    {clipRequest?.titleClipRequest}
                  </p>
                  <div>

                  <AudioPlayer ref={props.innerRef} src={SRC} onPlay={audioHandler} onEnded={audioHandler} onPause={audioHandler} layout='stacked' customVolumeControls={[]}
                  customControlsSection={[
                    RHAP_UI.MAIN_CONTROLS,

                    RHAP_UI.VOLUME
                  ]}
                  customProgressBarSection={
                    [
                      RHAP_UI.CURRENT_TIME,
                      <div>/</div>,
                      RHAP_UI.DURATION,
                      RHAP_UI.PROGRESS_BAR,
                    ]
                  }
                  // className={`w-100 mb-3 ${isAudioPlayerShowing ? `d-block` : `d-none`}`} 
                  className={`w-100 mb-3 d-block`} customAdditionalControls={[]}  customIcons={{rewind: <i className="rewind fas fa-redo"></i> , forward: <i className="forward fas fa-redo"></i> }}/>
                  
                  </div>
                  <div className={`${props.isPodcastOwner || loggedUserId.current === clipRequest.userClipRequest._id ? "justify-content-between" :  "justify-content-center"} d-flex`}>
                    <div>
                      <div className="d-inline-block me-5">
                        <i className={`${userVote === true ? `fa-solid fa-thumbs-up` : `far fa-thumbs-up`} me-2`} onClick={() => {voteHandler(1)}}></i><span>{usersLikesClipRequest.length}</span>
                      </div>
                      <div className="d-inline-block">
                        <i className={`${userVote === false ? `fa-solid fa-thumbs-down` : `far fa-thumbs-down`} me-2`} onClick={() => {voteHandler(0)}}></i><span>{usersDislikesClipRequest.length}</span>
                      </div>
                    </div>
                      <div>
                        { props.isPodcastOwner &&
                          <i className="fas fa-check me-5" onClick={clipRequestToResponseHandler}></i>
                        }
                        { (props.isPodcastOwner || loggedUserId.current === clipRequest.userClipRequest._id) &&
                          <i className="fas fa-trash me-2" onClick={deleteClipRequestHandler}></i>
                        }
                      </div>
                    
                </div>
                
                </div>
              </div>
            </div>
          </motion.div>
      }
      </AnimatePresence>
    );
}

export default AudioInboxCard;