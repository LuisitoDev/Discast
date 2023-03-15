import React, {useEffect, useState} from 'react';
import Header from '../UI/Header/Header';
import UploadFirstOpinion from './UploadFirstOpinion/UploadFirstOpinion';
import UploadInfoPodcast from './UploadInfoPodcast/UploadInfoPodcast';

import './UploadPodcast.css';

const UploadPodcast = () => {

    const [ infoPodcastIsVisible, setInfoPodcastVisible ] = useState(true);

    const [ validations, setValidations ] = useState({
        isTitleValid: null,
        isImageValid: null,
        isPrivacyValid: null,
        isFileUploaded: null
    });

    const [podcastInfoData, setPodcastInfoData] = useState({
        podcastTitle: "",
        podcastImage: "",
        podcastFile: "",
        podcastStartPreviewSecond: 0,
        podcastEndPreviewSecond: 20,
        podcastPrivacy: "public"
    });

    useEffect(() => {

        if(podcastInfoData.podcastTitle){
            setValidations(old => {
                return {
                    ...old,
                    "isTitleValid": true,
                }
            });
        }

        if(podcastInfoData.podcastImage){
            setValidations(old => {
                return {
                    ...old,
                    "isImageValid": true,
                }
            });
        }

        if(podcastInfoData.podcastPrivacy) {
            setValidations(old => {
                return {
                    ...old,
                    "isPrivacyValid": true,
                }
            });
        }

        if(podcastInfoData.podcastFile){
            setValidations(old => {
                return {
                    ...old,
                    "isFileUploaded": true,
                }
            });
        }

    }, [podcastInfoData.podcastTitle, 
        podcastInfoData.podcastImage,
        podcastInfoData.podcastPrivacy,
        podcastInfoData.podcastFile])


    return (
        <React.Fragment>
            <Header/>
            <div className="container-fluid text-white">
                <div className="row justify-content-center p-3">
                    <div className="col-12 col-md-10 col-lg-6 col-xxl-4 uploadPodcastContainer p-3 p-md-4">
                    <h1 className="mb-4 uploadPodcastTitle border-bottom pb-3">
                        Subir Podcast
                    </h1>
                        { infoPodcastIsVisible && <UploadInfoPodcast setComponentState={setInfoPodcastVisible} 
                                                                     setPodcastInfoData={setPodcastInfoData} 
                                                                     podcastInfoData={podcastInfoData}
                                                                     setValidations={setValidations}
                                                                     validations={validations}
                                                                     /> }
                        { !infoPodcastIsVisible && <UploadFirstOpinion setPodcastInfoData={setPodcastInfoData} 
                                                                       podcastInfoData={podcastInfoData}
                                                                       setValidations={setValidations}
                                                                       validations={validations}
                                                                       /> }
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default UploadPodcast;
