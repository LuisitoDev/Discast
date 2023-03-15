import CommentCard from "./CommentCard";
import UploadComment from "./UploadComment";
import ProfilePopup from "../../UI/Popup/Popup";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as PodcastService from "../../../services/podcast.service";
import { useParams } from "react-router-dom";
import AuthContext from "../../Utils/auth-context";
import GlobalAudioContext from "../../Utils/global-audio-context";
import useInfiniteScroll from "../../Utils/useInfiniteScroll";
import { AnimatePresence, motion } from "framer-motion";
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

import { createPortal } from "react-dom";
const Comments = (props) => {
  //Trash code Derek

  const [comments, setComments] = useState([]);
  const [isLoadingResquest, setIsLoadingRequest] = useState(true);
  const { podcastId } = useParams();
  const page = useRef(2);
  const authContext = useContext(AuthContext);
  const globalAudioContext = useContext(GlobalAudioContext)

  const containerCommentsRef = useRef(window);

  const moreComments = () => {
    if (comments.length % 5 === 0) {
      PodcastService.getCommentsByPodcastId(podcastId, page.current).then(
        (result) => {
          if (result.length > 0) {
            setComments((oldComments) => {
              return [...new Set([...oldComments, ...result])];
            });
            page.current = page.current + 1;
          }
          setIsFetching(false);
        }
      );
    }
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(
    moreComments,
    containerCommentsRef
  );
  useEffect(() => {
    PodcastService.getCommentsByPodcastId(podcastId, 1).then((result) => {
      if (result.status === "ERROR") props.error();
      setComments(result);
      setIsLoadingRequest(false);
    });
  }, []);
  //Trash code Derek

  // Pseudo Accordion
  const [isVisible, setIsVisible] = useState(false)
  const commentsDivRef = useRef(null)
  const hideCommentsHandler = () => {
      setIsVisible(old => !old)
  }

  useEffect(() => {
    if(isVisible) {
      commentsDivRef.current.scrollIntoView({block: 'start', behavior: 'smooth'})
    } else {
      window.scrollTo(0,0)
    }
  }, [isVisible])

  return (
    <div
      className="row justify-content-center"
      style={{ paddingBottom: `${globalAudioContext.podcastPlaying === null ? '0px' : '100px'}` }} 
    >
      
      <AnimatePresence>
        {!isVisible && <button className="btn btn-outline-primary text-white w-100 mb-2 sticky-top" onClick={hideCommentsHandler}>Comentarios <i className="fa-solid fa-angle-down"></i></button>}
        {isVisible && <button className="btn btn-primary text-white w-100 mb-2 sticky-top" onClick={hideCommentsHandler}>Ocultar Comentarios <i className="fa-solid fa-angle-up"></i></button>}
        {isVisible && 
        <motion.div
        key="commentsSection"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.1,
            },
          }}
          exit={{opacity: 0, transition: {duration: 0.3}}}
          className="d-flex flex-column align-items-center"
        >
        <div className="col-11 p-5 comments-background" ref={commentsDivRef}>
          {authContext.userInfo != null && (
            <React.Fragment>
              <h1 className="text-center mb-4">¿Qué deseas comentar?</h1>
              <div className="row">
                <div className="col-2 d-flex flex-column justify-content-center">
                  <ProfilePopup user={authContext.userInfo}>
                    <img
                      src={authContext.userInfo.imageFileUser ? (`https://programacion-web-2.herokuapp.com/api/file/${authContext.userInfo.imageFileUser}`) : AvatarPlaceholder}
                      alt="userImage"
                      className={`${authContext.userInfo.imageFileUser ? "profileImage" : "profileImagePlaceholder"} img-fluid img-thumbnail`}
                    />
                  </ProfilePopup>
                </div>

                <UploadComment
                  setComments={setComments}
                  page={page}
                  setIsFetching={setIsFetching}
                  error={props.error}
                  setIsLoadingRequest={setIsLoadingRequest}
                  comments={comments}
                  podcastId={podcastId}
                />
              </div>

              <div className="division-bar border border-primary my-5"></div>
            </React.Fragment>
          )}
          {comments.length === 0 && (
            <h1 className="text-center">No hay comentarios</h1>
          )}
          {comments.length !== 0 && <h1 className="text-center">Comentarios</h1>}
          {!isLoadingResquest &&
            comments.length !== 0 &&
            comments.map((comment, index) => (
              <CommentCard
                key={comment._id}
                commentId={comment._id}
                podcastId={podcastId}
                comment={comment}
              />
            ))}
        </div>
      </motion.div>
      }
    </AnimatePresence>
  
    </div>
  );
};

export default Comments;
