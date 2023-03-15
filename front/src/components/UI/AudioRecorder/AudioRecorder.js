/*                  Documentación

https://github.com/0x006F/react-media-recorder#readme plugin que se utilizó para grabar el audio
https://github.com/lhz516/react-h5-audio-player plugin que maneja el reproductor de audio estilizado
https://static.hanzluo.com/react-h5-audio-player-storybook documentacion visual del reproductor estilizado
https://github.com/evictor/get-blob-duration documentacion para traer y esperar la duracion del audio grabado

*/

import { useState, useRef, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import fixWebmDuration from "fix-webm-duration";
import AudioPlayer from 'react-h5-audio-player';
import Timer from '../Timer/Timer';

import './audio-player.css';


const AudioRecorder = (props) => {
    
    //Usamos el hook de useRef que usaremos para obtener la referencia del timer
    const timerRef = useRef();
    const audioPlayerRef = useRef();
    const blobUrlRef = useRef();


    var startTime;
    var duration;

    useEffect(() => {

        /*Si la variable es verdadera y ya no es igual a audioRecorder, entonces quiere decir que se grabo un archivo en el componente hermano y 
        por lo tanto tengo que borrarle el archivo que subio para evitar confusiones*/
        if(props.fileUploadedThrough && props.fileUploadedThrough !== "audioRecorder"){
            clearBlobUrl();
            timerRef.current.resetTimer();
        }

         /* Este codigo lo use para debugguear la variable props.fileUploadedThrough
        console.log("entro en el use effect del audio recorder");
        console.log(props.fileUploadedThrough);*/

    }, [props.fileUploadedThrough])

    const setNewFile = (blobUrl, blob) => {

        //Aqui creo el File a partir del blob que me regresa el componente de grabación
        duration = Date.now() - startTime;
        fixWebmDuration(blob, duration).then( function(fixedBlob) {
            // console.log(URL.createObjectURL(fixedBlob));
            blobUrlRef.current = URL.createObjectURL(fixedBlob);
            const file = new File([fixedBlob], "recording.webm", {type: "audio/webm"}); 
            // console.log(URL.createObjectURL(file))
            props.fileHandler(file);
            props.setFileUploadedThrough("audioRecorder");
        });

        /* Intentos fallidos 
        console.log(blob.arrayBuffer())
        blob.arrayBuffer().then( (buffer) => {
            const writter = new ID3Writer(buffer);
            writter.setFrame('TLEN', duration);
            writter.setFrame('TIT2', 'Home');
            writter.addTag()

            console.log(writter);

            const fixedBlob = new Blob(r);
            const fixedBlob = writter.getBlob();
            console.log(writter.getURL());

            const file = new File([fixedBlob], "recording.mp3", {type: "audio/mp3"});
            props.fileHandler(file);
            props.setFileUploadedThrough("audioRecorder");

        });

        const file = new File([fixedBlob], "recording.mp3", {type: "audio/mpeg"});
        console.log(file);
        props.fileHandler(file);
        props.setFileUploadedThrough("audioRecorder");

        console.log(duration);
        

        const file = new File([blob], "recording.mp3", {type: "audio/mpeg"});
        props.fileHandler(file);
        props.setFileUploadedThrough("audioRecorder");
        */
        
    }

    const onStart = () => {
        startTime = Date.now();
        // console.log(startTime);
    }

    //Aquí estamos usando un hook customizado que viene en el plugin de grabador de audio, practicamente nos devolvera un objeto con los mismos campos que le estoy pasando.
    const {
        status, //Nos entregara la enumeración de estado, este campo es informativo y lo uso mas adelante para intercambiar vistas
        startRecording, //una función que ayuda para empezar a grabar, que lo asocie a un botón 
        stopRecording, //una función que ayuda para parar de grabar, que tambien lo asocie a un botón.
        clearBlobUrl, //una función que te ayuda a quitar la grabación anterior si es que se le da click en el botón de borrar audio
        mediaBlobUrl, //el url del blob que se grabó, se usa para integrarlo al reproductor de audio, viene siendo el source de audio.
    } = useReactMediaRecorder({ audio: true, blobPropertyBag: {type: "audio/webm"}, mediaRecorderOptions: {mimeType: "audio/webm"}, onStop: setNewFile, onStart: onStart}) //Aquí le decimos que solo grabaremos audio y que el material resultante es un mp3 y este vendra a parar al blob



    //Estas son las funciones que encapsulan las subfunciones que afectan los estados del timer y de la grabadora de audio.
    const startRecordingAndTimer = () => {
        startRecording();
        timerRef.current.startTimer();
    }

    const stopRecordingAndTimer = () => {
        stopRecording();
        timerRef.current.stopTimer();
    }
    
    const resetRecordingAndTimer = () => {
        clearBlobUrl();
        props.fileHandler();
        timerRef.current.resetTimer();
    }

    return(        
        <div className="d-flex flex-column justify-content-center align-items-center w-100">
            {/* <p>{status}</p> */ /* Esta etiqueta se puede usar para debuggear los estados */}
            <h2 className={`mb-4 ${status === "recording" || status === "acquiring_media" ? "d-block" : "d-none"}`} >
                <Timer ref={timerRef}/>
            </h2>
            {status === "stopped" && 
            <AudioPlayer ref={audioPlayerRef} src={blobUrlRef.current} className="mb-4" autoPlay customVolumeControls={[]} customAdditionalControls={[]} 
            customIcons={{rewind: <i className="rewind fas fa-redo"></i> , forward: <i className="forward fas fa-redo"></i> }}/>}
            
            <div className="mb-3">
                
                {status === "idle" && 
                <button type="button" className="btn btn-primary text-white px-5 py-2 mx-3" onClick={startRecordingAndTimer}>
                    <i className="fas fa-microphone"></i> Grabar audio
                </button>}

                {(status === "recording" || status === "acquiring_media") && 
                <button type="button" className="btn btn-danger text-white px-5 py-2 mx-3" onClick={stopRecordingAndTimer}>
                    <i className="fas fa-stop"></i> Detener grabacion
                </button>}

                {status === "stopped" && 
                <button type="button" className="btn btn-secondary text-white px-5 py-2 mx-3" onClick={resetRecordingAndTimer}>
                    <i className="fas fa-trash"></i> Borrar Audio
                </button>}

            </div>
        </div>
    );
}

export default AudioRecorder;