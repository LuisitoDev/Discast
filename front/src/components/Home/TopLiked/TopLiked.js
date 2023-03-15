import React,{useState, useEffect, useRef, useContext} from 'react';
import * as PodcastService from '../../../services/podcast.service'
import PodcastCard from "../../UI/PodcastCard/PodcastCard"
import SearchContext from "../../Utils/search-context";
import useInfiniteScroll from '../../Utils/useInfiniteScroll';

const TopLiked = () => {
    const searchContext = useContext(SearchContext)
    const [podcasts, setPodcasts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(2)
    const containerPodcastRef = useRef(window)
    
    const morePodcasts = () => {
        if(podcasts.length % 5 === 0)
        PodcastService.getTopLikedPodcast(page).then(result => {
            setPodcasts(oldPodcast => {
                return [...new Set([...oldPodcast, ...result])]
            })
            setPage(page => page+1)
            setIsFetching(false)
        })
    }
    const [isFetching, setIsFetching] = useInfiniteScroll(morePodcasts, containerPodcastRef)
    
    useEffect(()=> {
        setPage(2)
        PodcastService.getTopLikedPodcast(1, searchContext.searchText).then(result => {
            if(result){
                setPodcasts(result)
            }
            setIsLoading(false)
        })
    }, [searchContext.searchText])

    return (
        <React.Fragment>
            {isLoading && 
            <div className="text-center" >
                <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            {(podcasts.length === 0 && !isLoading) && <h2 className='text-center mt-5 fw-bold'>No hay podcast con likes.</h2>}
            {podcasts.map(podcast => (<PodcastCard key={podcast._id} podcast={podcast}/>))}
        </React.Fragment>
    );
}

export default TopLiked;