import { useNavigate } from 'react-router-dom';
import FileUploader from '../../UI/FileUploader/FileUploader';
import AudioRecorder from '../../UI/AudioRecorder/AudioRecorder';
import { useEffect, useState, useContext } from 'react';
import * as PodcastService from "../../../services/podcast.service";
import AuthContext from "../../Utils/auth-context";

const UploadFirstOpinion = (props) => {

    const authContext = useContext(AuthContext);

    const [fileUploadedThrough, setFileUploadedThrough] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    let navigate = useNavigate();

    const submitHandler = (e)=>{
        e.preventDefault();

        if(!props.podcastInfoData.podcastTitle){
            props.setValidations(old => {
                return {
                    ...old,
                    "isTitleValid": false,
                }
            });
        }
            
        if(!props.podcastInfoData.podcastImage){
            props.setValidations(old => {
                return {
                    ...old,
                    "isImageValid": false,
                }
            });
        }

        if(!props.podcastInfoData.podcastPrivacy){
            props.setValidations(old => {
                return {
                    ...old,
                    "isPrivacyValid": false,
                }
            });
        }

        if(!props.podcastInfoData.podcastFile) {
            props.setValidations(old => {
                return {
                    ...old,
                    "isFileUploaded": false,
                }
            });
        }

        if( props.podcastInfoData.podcastTitle && props.podcastInfoData.podcastImage &&
            props.podcastInfoData.podcastPrivacy && props.podcastInfoData.podcastFile
            ) {
                setIsLoading(true);
                PodcastService.uploadNewPodcast(authContext.getAuthHeader(), props.podcastInfoData).then(result => {
                    setIsLoading(false);
                    navigate('/podcast/' + result._id);
                });
            }
    }

    const fileHandler = (file) => {
        props.setPodcastInfoData(old => {
            return {
                ...old,
                "podcastFile": file
            }
        });
    }

    return (

        <form onSubmit={submitHandler} action="" method="post" encType="multipart/form-data">
            { !isLoading &&
                <div className="rounded-3 p-0 p-md-5 mb-2">
                    <FileUploader fileHandler={fileHandler} fileUploadedThrough={fileUploadedThrough} setFileUploadedThrough={setFileUploadedThrough}/>
                    <p className="fs-4 d-none d-md-block text-center">ó</p>
                    <AudioRecorder fileHandler={fileHandler} fileUploadedThrough={fileUploadedThrough} setFileUploadedThrough={setFileUploadedThrough}/>
                    { props.validations.isFileUploaded === false &&
                        <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> ¡Has olvidado crear o subir un archivo!</div>
                    }
                    { (props.validations.isTitleValid === false || props.validations.isImageValid === false || props.validations.isPrivacyValid === false) && 
                        <div className="text-danger mt-3 w-100 text-center"><i className="fa-solid fa-circle-exclamation"></i> Un error inesperado ha sucedido, intentalo mas tarde</div>
                    }
                </div>
            }
            { !isLoading && 
                <div className="mb-3">
                    <button type="submit" className="btn btn-primary text-white mx-auto d-block px-5 py-2">
                        Opinar
                    </button>
                </div>
            }
            { isLoading && 
                <div className="text-center" >
                    <div className="spinner-border text-primary" style={{width:"5rem", height:"5rem"}}>
                        <span className="visually-hidden">Uploading...</span>
                    </div>
                    <p className='fs-4 mt-3'>¡Estamos subiendo tu podcast!</p>
                </div>
            }
        </form>
    );
}

export default UploadFirstOpinion;