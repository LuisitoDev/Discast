import React, {useState, useContext, useEffect} from 'react'
import moment from 'moment'
import 'moment/locale/es-mx'
import { useNavigate } from 'react-router-dom'
import GlobalAudioContext from '../../Utils/global-audio-context'
import AnimatedBars from '../AnimatedBars/AnimatedBars'
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

const PodcastCard = (props) => {
  const privacies = {
    public: ["Publico", "fa-globe"],
    only_friends: ["Solo Amigos","fa-user-group"],
    only_me: ["Solo Yo", "fa-user-lock"]
  }


  moment.locale('es-mx')
  const state = {
      open: "Abierto",
      paused: "Pausado",
      closed: "Finalizado"
  }
    const podcast = props.podcast
    
    const [imageLoading, setImageLoading] = useState(true)
    const imageLoaded = () => {
        setImageLoading(false)
    }
    const getUserInPodcastImages = () => {
      var userImages = []
      let i=0
      for(i=0; i<podcast.usersInPodcast.length; i++){
          if(i === 3) break
          userImages.push(
          <img
            key={podcast.usersInPodcast[i].imageFileUser}
            src={podcast.usersInPodcast[i].imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${podcast.usersInPodcast[i].imageFileUser}`) : AvatarPlaceholder}
            alt=""
            className="me-1"
            style={{borderRadius: "100%", height: "30px", width: "30px"}}
          />
          )
      }
      if(podcast.usersInPodcast.length > 3){
        userImages.push(
          <span
            style={{
                backgroundColor: "rgb(54,54,54)",
                borderRadius: "100%"
            }}
            className="p-1 d-flex align-items-center fs-5"
          >
            +{podcast.usersInPodcast.length - i}
          </span>
        )
      }
      return userImages
    }

    let navigate = useNavigate()
    const podcastDetailsHandler = (e) => {
      navigate('/podcast/' + podcast._id)
    }


    const globalAudioContext = useContext(GlobalAudioContext)

    const playPodcastHandler = (e) => {
        e.stopPropagation()
        
        if(isPodcastOnGlobal && globalAudioContext.isPlaying){
          globalAudioContext.pause()
          return
        }

        if(isPodcastOnGlobal && !globalAudioContext.isPlaying){
          globalAudioContext.play()
          
          if(globalAudioContext.isEnded)
            globalAudioContext.setIsPlaying(true)
          // return;
        }
        globalAudioContext.setPodcast(podcast)

    }

    const [isPodcastOnGlobal, setIsPodcastOnGlobal] = useState(false)
    useEffect(()=> {
        if(globalAudioContext.podcastPlaying?._id === podcast._id ){
          setIsPodcastOnGlobal(true)
        } else {
          setIsPodcastOnGlobal(false)
        }


    }, [globalAudioContext, podcast._id])
    
    const transformDuration = (duration) => {
      if(duration === undefined)
        return  
        let h = Math.floor(duration/3600).toString().padStart(2,'0'),
            m = Math.floor(duration % 3600 / 60).toString().padStart(2, '0'),
            s = Math.floor(duration % 60).toString().padStart(2, '0')
      if(h === '00')
          return `${m} : ${s}`
      return `${h} : ${m} : ${s}`
    }

    return (
        <div className="row m-0 my-5">
          <div className="col-8 mx-auto" style={{borderRadius: "12px"}}>
            <div className="row p-5 podcastCard" onClick={podcastDetailsHandler} style={{borderColor: isPodcastOnGlobal &&"#0477bf"}}>
              <div className="col-6 d-flex flex-column justify-content-between">
                <h1 className={`fs-1 text-truncate ${isPodcastOnGlobal && "text-primary"}`}>
                  {podcast.titlePodcast}
                </h1>
                <span className="fs-4 mb-4">{transformDuration(podcast?.durationPodcast?.$numberDecimal)}</span>

                <button
                  className="row p-0 mb-4 fs-4  btnPlayPodcast"
                  style={{width: "fit-content", border:isPodcastOnGlobal ? "3px solid #0477bf" : "3px solid #fff"}}
                  onClick={playPodcastHandler}
                >
                  <span className="p-0 col-12 d-flex align-items-center" >
                    {(isPodcastOnGlobal && globalAudioContext.isPlaying) && 
                      <AnimatedBars/>
                    }
                    <p className="p-3 m-0">Escuchar podcast de fondo</p>
                    {(isPodcastOnGlobal && globalAudioContext.isPlaying) ?<i className="far fa-pause-circle px-3 fs-1"></i> : <i className="far fa-play-circle px-3 fs-1"></i>}
                    
                  </span>
                </button>

                <span className="fs-5"
                  >{podcast.usersLikesPodcast.length} likes <i className="fas fa-thumbs-up"></i
                ></span>
              </div>
              <div className="col-2 d-flex flex-column justify-content-between">
                <div className="row">
                  <div className="col-12 d-flex align-items-center">
                    {getUserInPodcastImages()}
                  </div>
                </div>

                <div className="row">
                  <h3 className="m-0">{state[podcast.statePodcast.name]}</h3>
                </div>
              </div>

              <div className="col-4">
                <p className="text-end m-0 p-3">
                  {moment(podcast.createdAt).fromNow()}
                  <span className='ms-3'> <i class={`fa-solid ${privacies[podcast.privacyPodcast?.name][1]}`}></i></span>
                </p>
                <div className="position-relative" >
                  {imageLoading &&  <div className="text-center">
                        <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                    <img
                        src={`https://programacion-web-2.herokuapp.com/api/file/${podcast.imageFilePodcast}`}
                      className={`img-fluid ${imageLoading && 'd-none'}`}
                      alt=""
                      onLoad={imageLoaded}
                      style={{borderRadius: "2em", height: "220px", width: "100%"}}
                    />
                   
                  
                </div>

                <p className="text-end m-0 mt-3">{podcast.viewsNumberPodcast} reproducciones</p>
              </div>
            </div>
          </div>
        </div>  
    );
}

export default PodcastCard