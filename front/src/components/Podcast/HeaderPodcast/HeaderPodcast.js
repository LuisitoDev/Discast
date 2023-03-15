import React, { useState, useRef, useContext, useEffect } from "react";
import Modal from "../../UI/Modal/Modal";
import ModalUpload from "../../UI/ModalUpload/ModalUpload";
import AuthContext from "../../Utils/auth-context";
import {addElementToStateArray, removeElementFromStateArray} from '../../Utils/manipulate-state-arrays';
import * as PodcastService from "../../../services/podcast.service";

import '../../UI/AudioRecorder/audio-player.css';
import './HeaderAudioPlayer.css';

const HeaderPodcast = (props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const modalRef = useRef();
  const headerProps =
    "flex-column-reverse flex-md-row justify-content-center align-items-center pb-0";
  const dialogProps = "modal-lg";
  const bodyProps = "px-md-4 px-0";
  const contentProps = "";
  const isInitialMount = useRef(true);

  const {podcast} = props
  

  const authContext = useContext(AuthContext);
    
  const [userVote, setUserVote] = useState(false)
  const [usersLikesPodcast, setUsersLikesClipPodcast] = useState([])
  const loggedUserId = useRef(null)

  
  useEffect(()=> {
    if(podcast !== null && isInitialMount.current){
      setUsersLikesClipPodcast(podcast?.usersLikesPodcast);
      isInitialMount.current = false;
    }

    const isLoggedIn = authContext.isLoggedIn();
    const userInfo = authContext.userInfo;

    if (isLoggedIn !== null && userInfo !== null && podcast !== null){

        loggedUserId.current = authContext.userInfo._id;
                    
        if (loggedUserId.current !== undefined){
            if (usersLikesPodcast.includes(loggedUserId.current)){
                setUserVote(true)
            }
            else {
                setUserVote(false)
            }
        }       
    }

    return () => console.log('se quito el timeline')
    }, [authContext, podcast, usersLikesPodcast])
  

    
    const voteHandler = () => {
      if (!authContext.isLoggedIn())
          return;

      const usersLikesClipResponseBefore = usersLikesPodcast

      if (!usersLikesPodcast.includes(loggedUserId.current)){
          addElementToStateArray(usersLikesPodcast, setUsersLikesClipPodcast, loggedUserId.current)
      }
      else {
          removeElementFromStateArray(usersLikesPodcast, setUsersLikesClipPodcast, loggedUserId.current)
      }

      PodcastService.votePodcast(authContext.getAuthHeader(), podcast._id).then(result => {
          if(!result || result.status !== 'SUCCESS') {
              //Cancelamos el like
              setUsersLikesClipPodcast(usersLikesClipResponseBefore);
          }
      })
    }



  const openModal = (e) => {
    e.preventDefault();
    setShowUploadModal(true);
  };

  const closeModal = () => {
    setShowUploadModal(false);
  };

  const privacies = {
    default: "",
    public: ["Publico", "fa-globe"],
    only_friends: ["Solo Amigos","fa-user-group"],
    only_me: ["Solo Yo", "fa-user-lock"]
  }


  const states = {
    default: "",
    open: "Abierto",
    paused: "Pausado",
    closed: "Finalizado"
  }

  // Function to define if opinion button is gonna be showed 
  
  const showOpinionButton = () => {
      if(props.podcast?.statePodcast.name === 'closed' || (props.podcast?.statePodcast.name === 'paused' && props.podcast?.authorPodcast._id !== authContext.userInfo?._id))
      return
      
      if(!authContext.isLoggedIn())
      return

      if(props.podcast?.authorPodcast._id !== authContext.userInfo?._id){
        switch(props.podcast?.privacyPodcast?.name){
          case 'only_me':
            return
          case 'only_friends':
            const isFriend = props.podcast?.authorPodcast.friendsUser.some(friendId => friendId === authContext.userInfo?._id)
            
            if(!isFriend)
              return

            break
          case 'public':
            break
          default:
            return
        }
        
      }

      

      return (<button
        className="btn btn-primary w-75 text-white fs-4 p-2"
        onClick={() => modalRef.current.open()}
      >
        <i className="fa-solid fa-microphone-lines"></i> Opinar
      </button>)
  }
  showOpinionButton()
  return (
    <div className="row border-2 border-primary border-bottom mb-3 ">
      <Modal
        dialogClasses={dialogProps}
        bodyClasses={bodyProps}
        headerClasses={headerProps}
        contentClasses={contentProps}
        ref={modalRef}
        type="Upload"
      >
        {<ModalUpload clipResponses={props.clipResponses} setClipResponses={props.setClipResponses} podcast={props.podcast}
                      clipRequests={props.clipRequests} setClipRequests={props.setClipRequests}
                      scrolldivTimelineRef={props.scrolldivTimelineRef}
                      scrolldivInboxRef={props.scrolldivInboxRef}></ModalUpload>}
      </Modal>
      <div className="headerAudioPlayerContainer col-2 d-flex justify-content-center align-items-center">
        {/* <AudioPlayer autoPlay src='' customVolumeControls={[]} 
        customAdditionalControls={[]} showJumpControls={false} 
        customProgressBarSection={[]} customIcons={{ play: <i id="playBtn" className="fas fa-play-circle display-3"></i>}} /> */}
        {props.isPlaying ? 
          <i id="playBtn" className="fas fa-pause-circle display-3 p-3" onClick={props.onTogglePlay}></i>
          :
          <i id="playBtn" className="fas fa-play-circle display-3 p-3" onClick={props.onTogglePlay}></i>
        }
        
      </div>
      <div className={`col-8 mx-auto d-flex align-items-center justify-content-center ${ authContext.isLoggedIn() && "border-2 border-end border-primary"} `}>
                    <img src={`https://programacion-web-2.herokuapp.com/api/file/${props.podcast?.imageFilePodcast}`} alt="podcast" className='img-fluid me-3' style={{height: "75px", borderRadius: "10px"}}/>
                    <h1 style={{width: "60%"}} className="text-white text-center fw-bold text-truncate me-3" title={props.podcast?.titlePodcast}>{props.podcast?.titlePodcast}</h1>
                    <button style={{fontSize: "12px"}}
                    className="btn btn-outline-primary w-auto text-white  fw-light border border-white border-1 d-flex align-items-center"
                    onClick={props.passToGlobalAudio}
                  >
                    Escuchar de fondo <i className="far fa-play-circle fs-4 ms-1"></i>
                  </button>
                  {authContext.isLoggedIn() &&
                    <div className="ms-3">
                        <i className={`${userVote === true ? `far fa-solid fa-thumbs-up fa-2x` : `far fa-thumbs-up fa-2x`}`} onClick={() => {voteHandler()}}></i>                        
                    </div>
                  }
                  
      </div>
    
        <div className="col-2 d-flex align-items-center justify-content-center flex-column">
          <div className="mb-2 w-75">
            <span className="w-100 d-block text-center" style={{borderRadius: "16px", background: "#0477bf"}}>{states[props.podcast?.statePodcast?.name ?? "default"]} <i class={`fa-solid ms-1 ${privacies[props.podcast?.privacyPodcast?.name ?? "default"][1]}`}></i></span>
            {/* <span><i class={`fa-solid ${privacies[props.podcast?.privacyPodcast?.name][1]}`}></i></span> */}
          </div>
          {showOpinionButton()}
        </div>
     
    </div>
  );
};

export default HeaderPodcast;
