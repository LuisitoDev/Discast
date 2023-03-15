import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../UI/Header/Header";
import HeaderPodcast from "./HeaderPodcast/HeaderPodcast";
import Timeline from "./Timeline/Timeline";
import Inbox from "./Inbox/Inbox";
import GlobalAudioPlayer from "../UI/GlobalAudioPlayer/GlobalAudioPlayer";
import * as PodcastService from "../../services/podcast.service";
import Comments from "./Comments/Comments";
import { AnimatePresence, motion } from "framer-motion";
import "./Podcast.css";
import { MotionConfig } from "framer-motion";

const Podcast = () => {
  const [isAnError, setIsAnError] = useState(false);
  const [isFocus, setIsFocus] = useState("");
  const [clipRequests, setClipRequests] = useState([]);
  const [clipResponses, setClipResponses] = useState([]);

  const [isLoadingPodcast, setIsLoadingPodcast] = useState(true);
  const [podcast, setPodcast] = useState(null);
  const [isInboxVisible, setIsInboxVisible] = useState(true);
  const { podcastId } = useParams();
  const [podcastColumns, setPodcastColumns] = useState("col-9");
  const [inboxColumns, setInboxColumns] = useState("col-3");

  const scrolldivTimelineRef = useRef();
  const scrolldivInboxRef = useRef();

  const focusHandler = (focusOn) => {
    setIsFocus(focusOn);
  };
  const inboxMenuHandler = () => {
    console.log("AAA");

    setIsInboxVisible((old) => !old);
    setPodcastColumns((old) => {
      if (old === "col-9") {
        return "col-11";
      }
      if (old === "col-11") {
        return "col-9";
      }
    });
    setInboxColumns((old) => {
      if (old === "col-3") {
        return "col-1";
      }
      if (old === "col-1") {
        return "col-3";
      }
    });
  };
  const podcastErrorHandler = () => {
    setIsAnError(true);
  };

  useEffect(() => {
    setIsLoadingPodcast(true);

    PodcastService.getPodcastById(podcastId).then((result) => {
      if (result.status === "ERROR") podcastErrorHandler();
      setPodcast(result);
      setIsLoadingPodcast(false);
    });
  }, [podcastId, isAnError]);

  return (
    <React.Fragment>
      <Header />
      <main className="row container-fluid p-0 m-0 text-white">
        {!isAnError && (
          <>
            <div className={`px-4 ${podcast?.privacyPodcast.name !== 'only_me' ? podcastColumns : 'col-12'}`}>
              {/* <HeaderPodcast/> */}
              <Timeline
                focusOn={isFocus}
                setFocusOn={focusHandler}
                isLoadingPodcast={isLoadingPodcast}
                podcast={podcast}
                clipResponses={clipResponses}
                setClipResponses={setClipResponses}
                clipRequests={clipRequests}
                setClipRequests={setClipRequests}
                scrolldivTimelineRef={scrolldivTimelineRef}
                scrolldivInboxRef={scrolldivInboxRef}
              />

              <hr className="mx-2 text-primary" size="3" />
              <Comments />
            </div>
            {/* Hide inbox section when podcast is private */}
            {podcast?.privacyPodcast.name !== 'only_me' &&
            <div
              className={`${inboxColumns} p-0 sticky-top mt-2 position-relative`}
            >
              {isInboxVisible && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: 200 }}
                    animate={{
                      x: 0,
                      transition: {
                        duration: 0.3,
                      },
                    }}
                    className="sticky-top"
                  >
                    <button
                      type="button"
                      onClick={inboxMenuHandler}
                      className="btn btn-primary text-white sticky-top  sandwichButton w-100"
                    >
                      <i className="fa-solid fa-comments sandwichButton"></i> Ocultar Inbox
                    </button>
                    <Inbox
                      focusOn={isFocus}
                      setFocusOn={focusHandler}
                      isLoadingPodcast={isLoadingPodcast}
                      podcast={podcast}
                      clipResponses={clipResponses}
                      setClipResponses={setClipResponses}
                      clipRequests={clipRequests}
                      setClipRequests={setClipRequests}
                      scrolldivTimelineRef={scrolldivTimelineRef}
                      scrolldivInboxRef={scrolldivInboxRef}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
              {!isInboxVisible && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: -200 }}
                    animate={{
                      x: 0,
                      transition: {
                        duration: 0.3,
                      },
                    }}
                    className="sticky-top"
                  >
                    <button
                      type="button"
                      onClick={inboxMenuHandler}
                      className="btn btn-primary sticky-top text-white position-absolute end-0 me-2  sandwichButton"
                    >
                      <i className="fa-solid fa-comments sandwichButton"></i>
                    </button>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
            }
          </>
        )}
        {isAnError && (
          <div
            className="w-100 d-flex align-items-center justify-content-center flex-column"
            style={{ height: "80vh" }}
          >
            <span className="text-primary">
              <i className="fa-solid fa-triangle-exclamation fa-10x"></i>
            </span>
            <h1 className="fw-bold w-25 text-center">
              El podcast no existe o ocurrido un error
            </h1>
          </div>
        )}
      </main>
      {/* <GlobalAudioPlayer/> */}
    </React.Fragment>
  );
};

export default Podcast;
