import {useState, useContext} from 'react'
import { Link } from "react-router-dom";
import AuthContext from '../Utils/auth-context';
import * as PodcastService from '../../services/podcast.service'


const DashboardPodcast = (props) => {
    const authContext = useContext(AuthContext)
    const privacies = {
        public: ["Publico", "fa-globe"],
        only_friends: ["Solo Amigos","fa-user-group"],
        only_me: ["Solo Yo", "fa-user-lock"]
    }

    const states = {
        open: "Abierto",
        paused: "Pausado",
        closed: "Finalizado"
    }

    const [podcastState, setPodcastState] = useState(props.state?.name)
    const [isLoadingChangeState, setIsLoadingChangeState] = useState(false)
    const changeStatePodcastHandler = (e,state) => {
    setIsLoadingChangeState(true)
       PodcastService.updateStatePodcast(props.id,authContext.getAuthHeader(), state).then(result =>{
            setIsLoadingChangeState(false)

           if(result.status === "SUCCESS")
            setPodcastState(state)

       })
    }

    const statePodcastHandler = (state) => {
        return (e) => {
            changeStatePodcastHandler(e, state)
        } 
    }

    return(
        <div className="row g-0 px-3 podcast-row">
            <div className="d-flex align-items-center my-2">
                <img className="rounded-3"
                src={`https://programacion-web-2.herokuapp.com/api/file/${props.imageFilePodcast}`} alt="Podcast Cover"
                style={{width: "100px", height:"70px", objectFit:"cover"}}/>
                <div className='d-flex align-items-center' style={{width: "55%"}}>
                    <div className="ms-3">
                        <i class={`fa-solid ${privacies[props.privacy?.name][1]}`}></i>
                    </div>
                    <p className="fs-5 text-start m-0 ms-3 p-2 link d-block text-truncate"><Link to={`/podcast/${props.id}`}>{props.podcastTitle}</Link></p>
                </div>
                {isLoadingChangeState && 
                    <div className='m-auto'>
                        <div class="spinner-border text-primary " role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                }
                {!isLoadingChangeState &&
                    <div className='flex-grow-1 text-center'>
                        <span className="p-1" style={{borderRadius: "16px", background: "#0477bf"}}>{states[podcastState]}</span>
                        {podcastState === "open" &&
                            <>
                                <span className="mx-1">|</span>
                                <button className="btn-action-podcast me-2" onClick={statePodcastHandler('paused')}><i class="fa-solid fa-pause"></i></button>
                                <button className="btn-action-podcast" onClick={statePodcastHandler('closed')}><i class="fa-solid fa-stop"></i></button>
                            </>
                        }
                        {podcastState === "paused" &&
                            <>
                                <span className="mx-1">|</span>
                                <button className="btn-action-podcast me-2" onClick={statePodcastHandler('open')}><i class="fa-solid fa-play"></i></button>
                                <button className="btn-action-podcast" onClick={statePodcastHandler('closed')}><i class="fa-solid fa-stop"></i></button>
                            </>
                        }                       
                    </div>
                }
            </div>
        </div>        
    )
}

export default DashboardPodcast;