import React, {useState, useEffect,useRef,useContext} from "react";
import Header from "../UI/Header/Header";
import DashboardPodcast from "./DashboardPodcast";
import PodcastStats from "./PodcastStats";
import ProfilePopup from "../UI/Popup/Popup";
import useInfiniteScroll from "../Utils/useInfiniteScroll"
import AuthContext from "../Utils/auth-context"
import * as PodcastService from '../../services/podcast.service'
import * as UserService from '../../services/user.service'
import AvatarPlaceholder from "../../images/avatar_placeholder_user.png";


import './Dashboard.css';

const Dashboard = () => {
    const authContext = useContext(AuthContext)
    const [podcasts,setPodcasts] = useState([])
    const [favoriteAuthor, setFavoriteAuthor] = useState(null)
    const [userStats, setUserStats] = useState(null)
    const [page, setPage] = useState(2)
    const [isLoadingPodcasts, setIsLoadingPodcasts] = useState(true)
    const [isLoadingFavoriteAuthor, setIsLoadingFavoriteAuthor] = useState(true)
    const [isLoadingStats, setIsLoadingStats] = useState(true)
    const containerPodcastRef = useRef(window)

    const morePodcasts = () => {
        if(podcasts.length % 5 === 0)
        PodcastService.getPodcastsCreated(authContext.getAuthHeader(), page).then(result => {
            setPodcasts(oldPodcast => {
                return [...new Set([...oldPodcast, ...result])]
            })
            setPage(page => page+1)
            setIsFetching(false)
        })
    }
    const [isFetching, setIsFetching] = useInfiniteScroll(morePodcasts, containerPodcastRef)

    useEffect(()=> {
        if(authContext.isLoggedIn()){
            PodcastService.getPodcastsCreated(authContext.getAuthHeader(), 1).then(result => {
                setPodcasts(result)
                setIsLoadingPodcasts(false)
    
            })
            UserService.getFavoriteUser(authContext.getAuthHeader()).then(result => {
                console.log(result)
                setFavoriteAuthor(result)
                setIsLoadingFavoriteAuthor(false)
            })
            UserService.getUserStats(authContext.getAuthHeader()).then(result => {
                setUserStats(result)
                setIsLoadingStats(false)
            })
        }
    }, [authContext])
   
    return(
        <React.Fragment>
            <Header/>
            <main className="container-fluid text-white p-md-5">
                <h1 className="text-center dashboard-text mb-5 mt-5 mt-md-0">Discast Studio</h1>
                <div className="row row-cols-1 row-cols-md-4 g-3 my-0 mb-5">
                    <div className="col">
                        <div className="cardBackground d-flex flex-column justify-content-center align-items-center p-4">
                            {isLoadingStats && 
                                <div className="text-center" >
                                    <div className="spinner-border text-white">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                            <h1 className="">{userStats?.totalPodcast}</h1>
                            <i className="fas fa-podcast fs-3 my-2"></i>
                            <p className="fs-4 m-0 text-center">Podcast</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="cardBackground d-flex flex-column justify-content-center align-items-center p-4">
                            {isLoadingStats && 
                                <div className="text-center" >
                                    <div className="spinner-border text-white">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                            <h1 className="">{userStats?.totalClipResponse}</h1>
                            <i className="fas fa-microphone-alt fs-3 my-2"></i>
                            <p className="fs-4 m-0 text-center">Respuestas</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="cardBackground d-flex flex-column justify-content-center align-items-center p-4">
                            {isLoadingStats && 
                                <div className="text-center" >
                                    <div className="spinner-border text-white">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                            <h1 className="">{userStats?.totalClipRequest}</h1>
                            <i className="fas fa-paper-plane fs-3 my-2"></i>
                            <p className="fs-4 m-0 text-center">Clip Request</p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="cardBackground d-flex flex-column justify-content-center align-items-center p-4">
                            {isLoadingStats && 
                                <div className="text-center" >
                                    <div className="spinner-border text-white">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                            <h1 className="">{userStats?.totalComment}</h1>
                            <i className="fas fa-comment fs-3 my-2"></i>
                            <p className="fs-4 m-0 text-center">Comentarios</p>
                        </div>
                    </div>
                </div>
                {(!isLoadingFavoriteAuthor && favoriteAuthor) &&
                <div className="row my-5">
                    <div className="col mb-4">
                        <div className="cardBackground p-3 d-flex flex-column flex-md-row justify-content-center align-items-center">
                            {isLoadingFavoriteAuthor && 
                                <div className="text-center" >
                                    <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>}
                            {(!isLoadingFavoriteAuthor && favoriteAuthor) && <>
                                <ProfilePopup user={favoriteAuthor.authorPodcast}>
                                    {<img src={favoriteAuthor.authorPodcast.imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${favoriteAuthor.authorPodcast.imageFileUser}`) : AvatarPlaceholder} alt="userImage" 
                                    className={`${favoriteAuthor.authorPodcast.imageFileUser ? "profileImage" : "profileImagePlaceholder"} img-fluid img-thumbnail`}/>}
                                </ProfilePopup>
                                <div className="mx-4 flex-grow-1 d-flex flex-column justify-content-between">
                                    <div>
                                        <h4 className="d-none d-md-block">Hemos visto que te han gustado muchos podcast de este creador:</h4>
                                        <h5 className='fw-bold fs-1 mb-4'>{`${favoriteAuthor.authorPodcast.nameUser} ${favoriteAuthor.authorPodcast.apPaternoUser}`}</h5>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <p className="m-0 fs-5"><span className="fw-bold">{favoriteAuthor.authorPodcast.followingUser.length}</span> seguidos</p>
                                        <p className="m-0 fs-5"><span className="fw-bold">{favoriteAuthor.authorPodcast.followersUser.length}</span> seguidores</p>
                                    </div>
                                </div>
                            </>}    
                            
                        </div>
                    </div>
                </div>
                }
                <hr />
                <h2 className="h1 text-primary border-0 fw-bold text-center">Tus podcasts creados</h2>
                {isLoadingPodcasts && 
                    <div className="text-center" >
                        <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>}
                {podcasts.length === 0 &&
                    <h2 className="text-center mt-5 fw-light">No tienes podcasts creados.</h2>
                }    
                {podcasts.length !== 0 &&    
                <div className="my-5">
                    <div className="row g-0">
                        <div className="col-4">
                            <div className="row g-0">
                                <p className="fs-5 rounded-start bg-primary text-center m-0 p-2">Podcast</p>
                            </div>
                            <div className="podcast-column">
                                {podcasts.map(podcast => (<DashboardPodcast key={podcast._id} id={podcast._id} privacy={podcast.privacyPodcast} state={podcast.statePodcast} podcastTitle={podcast.titlePodcast} imageFilePodcast={podcast.imageFilePodcast}/>))}
                            </div>
                        </div>
                        <div className="PodcastStatsContainer col-8 ">
                            <div className="row g-0 flex-nowrap text-nowrap text-center fs-5">
                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl bg-primary">
                                    <p className="m-0 p-2">Vistas</p>
                                </div>
                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl bg-primary">
                                    <p className="m-0 p-2">Comentarios</p>
                                </div>
                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl bg-primary">
                                    <p className="m-0 p-2">Respuestas</p>
                                </div>
                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl bg-primary">
                                    <p className="m-0 p-2">Clip Requests</p>
                                </div>
                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl bg-primary">
                                    <p className="m-0 p-2">Likes</p>
                                </div>
                                <div className="col-12 col-md-5 col-lg-4 col-xl-3 col-xxl rounded-end bg-primary">
                                    <p className="m-0 p-2">Usuario más activo</p>
                                </div>
                            </div>
                            <div className="podcast-column">
                                {podcasts.map(podcast => (<PodcastStats key={podcast._id}
                                                                        views={podcast.views}
                                                                        comments={podcast.comments}
                                                                        responses={podcast.responses}
                                                                        requests={podcast.requests}
                                                                        likes={podcast.likes}
                                                                        mostActiveUser={podcast.mostActiveUser}/>))}
                            </div>
                        </div>
                    </div>
                </div>
                }
            </main>
        </React.Fragment>
    )
}

export default Dashboard;