import * as fileController from "../controllers/file.controller"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"
import {getAudioDurationInSeconds} from "get-audio-duration"
const mm = require('music-metadata');
const crypto = require('crypto');
const fs = require('fs')


const getFileReadStreamBuffer = async (idFile) => {
    
    const readStream = await fileController.getFileReadStreamData(idFile);

    readStream.read();

    return new Promise((resolve, reject) => {
     const chunks = [];
     readStream.on('data', data => {
      chunks.push(data);
     });

     readStream.on('end', () => {
        
      const data = Buffer.concat(chunks);

      if (readStream._fileKey !== null && readStream._fileKey !== undefined) {

       const authTagLocation = data.length - 16;
       const ivLocation = data.length - 32;
       const authTag = data.slice(authTagLocation);
       const iv = data.slice(ivLocation, authTagLocation);
       const encrypted = data.slice(0, ivLocation);
       const decipher = crypto.createDecipheriv(readStream._algorithm, readStream._fileKey, iv);
       decipher.setAuthTag(authTag);
       return resolve(Buffer.concat([decipher.update(encrypted), decipher.final()]));
      }
  
      resolve(data);
     });
     readStream.on('error', err => {
      reject(err);
     });
    });
}

const getDuration = async (readStreamBuffer, contentType) => {
    return new Promise((resolve, reject) => {
        mm.parseBuffer(readStreamBuffer, contentType).then((metadata) => {
            resolve(metadata.format.duration);
        }).catch((error) => {
            reject(error);
        });
    });
}

export const getFileDuration = async (idFile) => {
    try {
        
        /*
        //DEPRECATED DE LA LIBRERÍA "get-audio-duration"
        // const readStream = await getFileReadStreamBuffer(idFile)
        const readStream = await fileController.getFileReadStreamBuffer(idFile);
        
        // const readStream = fs.createReadStream('Sonido_alarma.mp3')

        console.log("readStream convertido", readStream)
        
        await getAudioDurationInSeconds(readStream).then((duration) => {
            console.log(duration)
            return duration;
        })
        */
        
        const fileData = await fileController.getFileData(idFile);
        const readStreamBuffer = await getFileReadStreamBuffer(idFile);
        const duration = await getDuration(readStreamBuffer, fileData.contentType);

        return Math.trunc(duration);

    }catch(exception){
        throw exception;
    }
}