/*                                Documentación

https://pqina.nl/filepond/docs/ en este link está la documentacion de filepond, el uploader de archivos 

Aquí solo encapsule el componente que nos proporciona filepond que es el uploader de archivos, ademas le integre un plugin del mismo proveedor para que
validara que solo se aceptan archivos de audio.

*/

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css';
import './FileUploader.css'
import { useEffect, useRef, useState } from 'react';

const FileUploader = (props) => {
    registerPlugin(FilePondPluginFileValidateType); //Con esta línea se activa el plugin de validación de archivos.

    const fileUploaderRef = useRef(); //Usamos esta variable para guardar la referencia de filepond que se esta usando, esto solo para poder disparar eventos mediante código
    const fileUploadedThrough = useRef(); /*Usamos esta variable para guardar una variable mutable, la cual ira cambiando por el comportamiento que se se presente entre este componente y su hermano "AudioRecorder"
                                            Asi la usé porque la necesitaba para una validacion en una funcion callback del componente filepond,
                                            de lo contrario no tendria el valor actual y no podia hacer la logica en use effect.*/
                                            
    fileUploadedThrough.current = props.fileUploadedThrough; //Aqui igualo la variable del state del padre que va tener un string alusivo al componente por el cual se subio el ultimo archivo

    useEffect(() => {
        
        /*Si la variable es verdadera y ya no es igual a fileUploader, entonces quiere decir que se grabo un archivo en el componente hermano y 
        por lo tanto tengo que borrarle el archivo que subio para evitar confusiones*/
        if(props.fileUploadedThrough && props.fileUploadedThrough !== "fileUploader"){ 
            fileUploaderRef.current.removeFile();
        } 

        /* Este codigo lo use para debugguear la variable props.fileUploadedThrough
        console.log("entro en el use effect del fileUploader");
        console.log(props.fileUploadedThrough); */
        
    }, [props.fileUploadedThrough])

    const onAddFile = (error, file) => {
        props.fileHandler(file.file);
        props.setFileUploadedThrough("fileUploader");
    }
    
    const onRemoveFile = (error, file) => {
        //Si la variable que referencia a props.fileUploadedThrough es igual a fileUploader entonces quiere decir que se quito el archivo directamente desde este componente y no habra archivos guardados
        if(fileUploadedThrough.current === "fileUploader"){
            props.fileHandler();
        }
    }

    return(
        <FilePond labelIdle={'<i class="fas fa-paperclip"></i> Arrastra aquí tu archivo de audio o <span class="filepond--label-action"> Busquemoslo </span>'}
        maxFiles={1}
        credits={false} 
        acceptedFileTypes={["audio/mp3", "audio/mpeg"]}
        labelFileTypeNotAllowed="Tipo de archivo no válido"
        fileValidateTypeLabelExpectedTypes="Se espera {allTypes}"
        onaddfile={onAddFile}
        onremovefile={onRemoveFile}
        ref={fileUploaderRef}
        />
    );

};

export default FileUploader;
