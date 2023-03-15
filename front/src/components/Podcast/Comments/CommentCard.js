import ProfilePopup from "../../UI/Popup/Popup";
import "./CommentCard.css";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import AuthContext from "../../Utils/auth-context";
import * as PodcastService from "../../../services/podcast.service";
import { useContext, useRef, useState } from "react";
import AvatarPlaceholder from "../../../images/avatar_placeholder_user.png";

const CommentCard = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const authContext = useContext(AuthContext);
  const [commentInfoData, setCommentInfoData] = useState({
    textComment: "",
    userComment: authContext.userInfo,
  });
  const textComment = useRef(null);

  const editHandler = () => {
    setIsEditing((old) => !old);
  };

  const editCommentHandler = () => {
    PodcastService.updateComment(
      authContext.getAuthHeader(),
      textComment.current.value,
      props.commentId
    ).then((result) => {
      console.log(result);
      props.comment.textComment = textComment.current.value;
      editHandler();
    });
  };
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
        }}
        className="row"
      >
        <div className="col-2 d-flex flex-column justify-content-center">
          <ProfilePopup user={props.comment.userComment}>
            {
              <img
                src={props.comment.userComment.imageFileUser ? 
                  (`https://programacion-web-2.herokuapp.com/api/file/${props.comment.userComment.imageFileUser}`) : AvatarPlaceholder}
                alt="userImage"
                className={`${props.comment.userComment.imageFileUser ? "profileImage" : "profileImagePlaceholder"} profileImage img-fluid img-thumbnail`}
              />
            }
          </ProfilePopup>
        </div>
        {!isEditing && (
          <div
            className="col-10 p-4 border border-3 border-primary my-4"
            style={{ borderRadius: "10px" }}
          >
            <div className="row mb-2 w-100">
              <div className="col-12 d-flex justify-content-between">
                <h5 className="fw-bold">
                  {props.comment.userComment.nameUser}
                </h5>
                <div className="d-flex align-items-center">
                  {" "}
                  <span className="me-5">
                    {moment(props.comment.createdAt).fromNow()}{" "}
                  </span>
                  {authContext.userInfo != null &&
                    authContext.userInfo._id ==
                      props.comment.userComment._id && (
                      <div
                        onClick={editHandler}
                        className="bg-white p-2 rounded-circle editButton"
                      >
                        <i className="fa-solid fa-pen-to-square fs-4 text-black "></i>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div>
              <p>{props.comment.textComment}</p>
            </div>
          </div>
        )}
        {isEditing && (
          <div
            className="col-10 p-4 border border-3 border-primary my-4"
            style={{ borderRadius: "10px" }}
          >
            <div className="row mb-2 w-100">
              <div className="col-12 d-flex justify-content-between">
                <h5 className="fw-bold">
                  {props.comment.userComment.nameUser}
                </h5>
                <div className="d-flex align-items-center">
                  {authContext.userInfo != null &&
                    authContext.userInfo._id ==
                      props.comment.userComment._id && (
                      <div
                        onClick={editHandler}
                        className="p-2 rounded-circle editButton"
                      >
                        <i className="fa-solid fa-circle-xmark fs-4 text-white"></i>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div>
              <textarea
                className="w-100 p-3 bg-white mb-3 border-3 border-primary  form-control bg-transparent text-white"
                rows="4"
                cols="50"
                ref={textComment}
              >
                {props.comment.textComment}
              </textarea>
              <button
                type="button"
                onClick={editCommentHandler}
                className="d-block mx-auto btn btn-primary text-white px-5 py-2"
              >
                Editar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CommentCard;
