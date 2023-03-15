import React, {useState,useRef, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom'
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import GlobalAudioContext from '../../Utils/global-audio-context'
import getBlobDuration from 'get-blob-duration';

const GlobalAudioPlayer = React.memo(() => {
    const audioPlayerRef = useRef(null)
    const globalAudioContext = useContext(GlobalAudioContext)
    const [isPlayable, setIsPlayable] = useState(false)
    // const [isPlaying, setIsPlaying] = useState(false)

    const {podcastPlaying, currentAudio} = globalAudioContext
    useEffect(()=> {
        const {podcastPlaying, currentTime, isEnded, isBack} = globalAudioContext
        if(podcastPlaying === null) {
            audioPlayerRef.current.audio.current.pause()
            audioPlayerRef.current.audio.current.currentTime = 0
            setIsPlayable(false)
            globalAudioContext.setIsPlaying(false)
        }

        if(isEnded) {
            // audioPlayerRef.current.audio.current.pause()
            audioPlayerRef.current.audio.current.currentTime = 0
            // globalAudioContext.ended()
        }

        if(isBack === true && isPlayable === true) {
           
            audioPlayerRef.current.audio.current.currentTime = currentTime
            globalAudioContext.normalState()
        }


    }, [globalAudioContext, isPlayable])

    useEffect(()=> {
        if(globalAudioContext.isPlaying === false){
            audioPlayerRef.current.audio.current.pause()
            return;
        }
        if(globalAudioContext.isPlaying){
            audioPlayerRef.current.audio.current.play()
            return;
        }
    }, [globalAudioContext.isPlaying])


    const playAudioHandler = ()=> {
        
        if(globalAudioContext.isEnded && globalAudioContext.podcastPlaying?.clipResponsesPodcast.length > 1){
            audioPlayerRef.current.audio.current.pause()
            // globalAudioContext.ended()

            return;
        }

        if(globalAudioContext.isEnded){
            globalAudioContext.ended()
            globalAudioContext.setIsPlaying(true)
            return
        }

        globalAudioContext.play()
    }

    const pauseAudioHandler = () => {


        if(globalAudioContext.isEnded){
            globalAudioContext.ended()
        }

        globalAudioContext.pause()
    }

    const endAudioHandler = (e)=>{
        globalAudioContext.next()
    }

    const canPlayThroughHandler = (e) => {
        setIsPlayable(true)
    }

    const disableHandler = () => {
        globalAudioContext.disable();
    }

    // const onLoadedMetaData = () => {
    //     // console.log(audioPlayerRef.current.audio.current);
    //     if(audioPlayerRef.current.audio.current.duration === Infinity){
    //         // console.log("Es infinito");
    //         audioPlayerRef.current.audio.current.currentTime = 1e101;
    //         getBlobDuration(`/api/file/${podcastPlaying?.clipResponsesPodcast[currentAudio]?.soundFileClipResponse}`).then((duration) => {
    //             // console.log(duration + "seconds)
    //             audioPlayerRef.current.audio.current.currentTime = 0;
    //         })
    //     }
    // }
  
    console.log('Soy el reproductor global cambiando')
    return (
        <div className={`w-100 fixed-bottom bg-primary d-flex justify-content-between px-3 py-1 border-1 border-top ${!podcastPlaying && 'd-none'}`}>
           <div></div>
            <AudioPlayer style={{width:"50%"}}
                        src={`https://programacion-web-2.herokuapp.com/api/file/${podcastPlaying?.clipResponsesPodcast[currentAudio]?.soundFileClipResponse}`} 
                        showDownloadProgress={false}
                        ref={audioPlayerRef}
                        onPlay={playAudioHandler}
                        onPause={pauseAudioHandler}
                        onEnded={endAudioHandler}
                        onCanPlayThrough={canPlayThroughHandler}
                        customProgressBarSection={
                            [
                                <div className='d-flex me-3' style={{width: "33%"}}>
                                    <img src={`https://programacion-web-2.herokuapp.com/api/file/${podcastPlaying?.imageFilePodcast}`} alt="" className='img-fluid me-3' style={{height:"40px", borderRadius:"10px", width: "75px"}}/>
                                    <div className='w-100 podcast-info-player'>
                                        <Link to={`/podcast/${podcastPlaying?._id}`} ><span className='fw-bolder d-block text-truncate text-white podcast-title-link py-1'>{podcastPlaying?.titlePodcast}</span></Link>
                                        <span className='fw-light text-truncate'>{`${podcastPlaying?.authorPodcast.nameUser} ${podcastPlaying?.authorPodcast.apPaternoUser}`}</span>
                                    </div>
                                </div>,
                                isPlayable && RHAP_UI.MAIN_CONTROLS,
                                !isPlayable && (
                                    <div className="spinner-border text-light">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ),
                                <div className='d-block' style={{width: "5%"}}> </div>,
                                RHAP_UI.VOLUME
                            ]
                          } 
                        customControlsSection={[]}
                        customVolumeControls={[]} 
                        customAdditionalControls={[]}
                        customIcons={{rewind: <i className="rewind fas fa-redo"></i> , forward: <i className="forward fas fa-redo"></i> }}/>
            <button className='btn text-white fs-3' onClick={disableHandler}><i className="fas fa-times"></i></button>
            
        </div>
    )
})

export default GlobalAudioPlayer