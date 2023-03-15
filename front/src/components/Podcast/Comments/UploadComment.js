import React, { useContext, useEffect, useState } from "react";
import * as PodcastService from "../../../services/podcast.service";
import AuthContext from "../../Utils/auth-context";
const UploadComment = (props) => {
  const authContext = useContext(AuthContext);
  const [commentInfoData, setCommentInfoData] = useState({
    textComment: "",
    userComment: authContext.userInfo,
  });

  const fieldsHandler = (e) => {
    //Agarramos el input y su valor
    const input = e.target;
    let value = e.target.value;

    setCommentInfoData((old) => {
      return {
        ...old,
        [input.name]: value,
      };
    });
  };
  const submitHandler = (e) => {
    e.preventDefault();

    if (commentInfoData.textComment) {
      PodcastService.insertComment(
        authContext.getAuthHeader(),
        commentInfoData.textComment,
        props.podcastId
      ).then(() => {
        PodcastService.getCommentsByPodcastId(props.podcastId, 1).then(
          (result) => {
            props.page.current = 2;
            props.setComments(() => {
              console.log("Dentro de setComments: " + props.page.current);
              return [...new Set([...result])];
            });
            console.log(props.comments);
            props.setIsFetching(false);
          }
        );
      });
    } else console.log("Error");
  };

  return (
    <div className="col-10 p-4 border border-3 rounded border-primary my-4">
      <h5 className="fw-bold mb-4">{authContext.userInfo.nameUser}</h5>
      <form onSubmit={submitHandler} action="" method="post">
        <div className="mb-3">
          <textarea
            className="form-control bg-transparent text-white"
            id="textarea"
            rows="2"
            name="textComment"
            onChange={fieldsHandler}
          ></textarea>
        </div>
        <button
          type="submit"
          className="d-block mx-auto btn btn-primary text-white px-5 py-2"
        >
          Comentar
        </button>
      </form>
    </div>
  );
};
export default UploadComment;
