import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import FileUploader from '../../UI/FileUploader/FileUploader';
import AudioRecorder from '../../UI/AudioRecorder/AudioRecorder';
import AuthContext from "../../Utils/auth-context";
import * as PodcastService from "../../../services/podcast.service";
import * as UserService from "../../../services/user.service";
import { addElementToStateArray } from "../../Utils/manipulate-state-arrays";

import "./ModalUploadOpinion.css";
import { useParams } from "react-router-dom";

const UploadPodcast = (props) => {

  const authContext = useContext(AuthContext);
  const {podcastId} = useParams();
  const userInfo = authContext.userInfo;

  
  const [isFileUploaded, setIsFileUploaded] = useState(null);
  const [isTitleValid, setIsTitleValid] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [fileUploadedThrough, setFileUploadedThrough] = useState(null);
  const [clipRequestInfoData, setclipRequestInfoData] = useState({
    titleClipRequest: "",
    soundFileClipRequest: "",
    secondStartPreviewClipRequest: 0,
    secondEndPreviewClipRequest: 20
  });

  //Este useEffect lo uso para dar avisos sobre validaciones en el front
  useEffect(() => {
    
    if(clipRequestInfoData.soundFileClipRequest){
      setIsFileUploaded(true);
    }

    if(clipRequestInfoData.titleClipRequest){
      setIsTitleValid(true);
    }

  }, [clipRequestInfoData.soundFileClipRequest, clipRequestInfoData.titleClipRequest])


  const submitHandler = (e)=>{
    e.preventDefault();
    
    //Aqui entra si son la misma persona o sea el dueño hizo una nueva opinion
    if(userInfo._id === props.podcast.authorPodcast._id){
        //Si el archivo de la clip request es valido entonces mandamos al server
        if(clipRequestInfoData.soundFileClipRequest) { 
          setIsLoading(true);
          PodcastService.AddClipResponse(podcastId, authContext.getAuthHeader(), clipRequestInfoData).then( result => {
            
            addElementToStateArray(props.clipResponses, props.setClipResponses, result.clipResponse);
            props.setOpen(false);
            setIsLoading(false);
            props.scrolldivTimelineRef.current.focus();
            props.scrolldivTimelineRef.current.scrollIntoView({ behavior: "smooth" });
          });

        } else { //Si no ponemos el aviso en el modal
          setIsFileUploaded(false);
        }

    } else { //Aqui si son personas diferentes al creador del podcast
      //Checamos si esta vacio la info del titulo del clip request, si si entonces seteamos la validacion a falso
      if(!clipRequestInfoData.titleClipRequest)
      setIsTitleValid(false);
      
      //Checamos si esta vacio el campo del archivo del clip request, si si entonces seteamos la validacion a falso
      if(!clipRequestInfoData.soundFileClipRequest)
      setIsFileUploaded(false);
      
      if(clipRequestInfoData.titleClipRequest && clipRequestInfoData.soundFileClipRequest){
        setIsLoading(true);
        PodcastService.AddClipRequest(podcastId, authContext.getAuthHeader(), clipRequestInfoData).then(result => {
          
          // console.log(result)
          addElementToStateArray(props.clipRequests, props.setClipRequests, result.clipRequest);
          props.setOpen(false);
          setIsLoading(false);
          console.log(props.scrolldivInboxRef.current);
          if(props.scrolldivInboxRef.current){
            props.scrolldivInboxRef.current.focus();
            props.scrolldivInboxRef.current.scrollIntoView({ behavior: "smooth", block: 'end' });
          }
        });
      }
    }
}

  const fileHandler = (file) => {
    setclipRequestInfoData(old => {
      return {
        ...old,
        "soundFileClipRequest": file
      }
    })
  }
  
  const inputHandler = (e) => {
    const {name, value} = e.target;

    setclipRequestInfoData(old => {
      return {
        ...old,
        [name]: value
      }
    })
  }

  return (
    <React.Fragment>
      <div className="arrowUp ms-2 d-none d-md-block"></div>
      <div className="contentBorderContainer rounded-3 p-0 p-md-5">
        <form onSubmit={submitHandler} action="" method="post" encType="multipart/form-data" id="modal-upload-form">
          { !isLoading &&
            <>
              { !(userInfo._id === props.podcast.authorPodcast._id) &&
                <div className="mb-3 mb-md-4">
                    <label htmlFor="titleInputCreateClipRequest" className="form-label">Título del clip request</label>
                    <input placeholder="Ingresa el título aquí" type="text" name="titleClipRequest" 
                    className="form-control w-100 bg-transparent border-2 border-primary text-white" id="titleInputCreateClipRequest"
                    onChange={inputHandler}/>
                    { isTitleValid === false &&
                      <div className="text-danger mt-3 w-100 text-center">
                        <i className="fa-solid fa-circle-exclamation"></i> ¡Has olvidado poner un título a tu opinion!
                      </div>
                    }
                    
                </div>
              }
              <FileUploader fileHandler={fileHandler} fileUploadedThrough={fileUploadedThrough} setFileUploadedThrough={setFileUploadedThrough}/>
              <p className="fs-4 d-none d-md-block text-center">ó</p>
              <AudioRecorder fileHandler={fileHandler} fileUploadedThrough={fileUploadedThrough} setFileUploadedThrough={setFileUploadedThrough}/>
              { isFileUploaded === false &&
                <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡Has olvidado crear o subir un archivo!</div>
              }
            </>
          }

          { isLoading && 
              <div className="text-center" >
                  <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                      <span className="visually-hidden">Uploading...</span>
                  </div>
                  <p className='fs-4 mt-3'>¡Estamos subiendo tu opinión!</p>
              </div>
          }
        </form>
      </div>
    </React.Fragment>
  );
};

export default UploadPodcast;
