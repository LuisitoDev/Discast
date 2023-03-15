import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import * as PodcastService from "../../../services/podcast.service";
import SearchContext from "../../Utils/search-context";
import PodcastCard from "../../UI/PodcastCard/PodcastCard";
import useInfiniteScroll from "../../Utils/useInfiniteScroll";

const Discover = () => {
  // const authContext = useContext(AuthContext)
  const searchContext = useContext(SearchContext);
  const [podcasts, setPodcasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(2);
  const containerPodcastRef = useRef(window);

  const morePodcasts = () => {
    console.log("Estoy buscando mas");
    if (podcasts.length % 5 === 0)
      PodcastService.getDiscoverPodcast(page, searchContext.searchText).then(
        (result) => {
          setPodcasts((oldPodcast) => {
            return [...new Set([...oldPodcast, ...result])];
          });
          setPage((page) => page + 1);
          setIsFetching(false);
        }
      );
  };
  const [isFetching, setIsFetching] = useInfiniteScroll(
    morePodcasts,
    containerPodcastRef
  );

  useEffect(() => {
    setPage(2);
    PodcastService.getDiscoverPodcast(1, searchContext.searchText).then(
      (result) => {
        if (result) {
          setPodcasts(result);
        }
        setIsLoading(false);
      }
    );
  }, [searchContext.searchText]);

  // console.log(podcasts)

  return (
    <React.Fragment>
      {isLoading && (
        <div className="text-center">
          <div
            className="spinner-border text-primary"
            style={{ width: "5rem", height: "5rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {podcasts.length === 0 && !isLoading && (
        <h2 className="text-center mt-5 fw-bold">
          No hay podcast que descubrir.
        </h2>
      )}
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast._id} podcast={podcast} />
      ))}
    </React.Fragment>
  );
};

export default Discover;
