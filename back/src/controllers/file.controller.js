// import mongoose from "mongoose"
// import Grid from "gridfs-stream"

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
// const methodOverride = require('method-override');
import * as message from "../libs/statusResponse"
import {ExceptionHandler, handleException} from "../libs/ExceptionHandler"
import {getFileDuration} from "../libs/fileDuration"

require("dotenv").config()


let gfs, gridfsBucket;
const conn = mongoose.connection;
conn.once("open", function () {
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    });

    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})


export const getFileDataById = async (req, res) => {
    try {
        await gfs.files.findOne({
            _id: mongoose.Types.ObjectId(req.params.id)
        }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }
            // File exists
            return res.json(file);
        });
    }catch(exception){
        return handleException(req, res, exception);
    }
}


export const getFileData = async (idFile) => {
    return new Promise((resolve) => {
        gfs.files.findOne({
            _id: mongoose.Types.ObjectId(idFile)
        }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
                throw "File doesn't exists"
            }
            // File exists
            // console.log(file);
            resolve(file);
        });
    })
}

export const getFileReadStreamData = async (idFile) => {
    return new Promise((resolve) => {
        gfs.files.findOne({
            _id: mongoose.Types.ObjectId(idFile)
        }, (err, file) => {
        
            // Check if file
            if (!file || file.length === 0) {
                throw "Not an image"
            }
            
            // Check if image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'audio/mpeg' || file.contentType === 'audio/x-flac' || file.contentType === 'audio/webm' ) {    
                const readStream = gridfsBucket.openDownloadStream(file._id);
                resolve(readStream)
            } else {
                throw "Not an image"
            }
    
        });
    })
}
    
//         // Check if file
//         if (!file || file.length === 0) {
//             throw ExceptionHandler("Not an image", 404)
//         }
        
//         // Check if image
//         if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'audio/mpeg' ) {    
//             const readStream = gridfsBucket.openDownloadStream(file._id);
//             callback(readStream)
//         } else {
//             throw ExceptionHandler("Not an image", 404)
//         }

//     });
// }

// export const getFileById = async (req, res) => {
//     try {
//         console.log("LLEGO AQUÍ")
//         const readStream = await getFileReadStreamData(req.params.id);
//         console.log("LLEGO AQUÍ 6")
//         if (!readStream)
//             readStream.pipe(res);
//         else
//             throw "Error, read Stream is null"

//     }catch(exception){
//         console.log("LLEGO AQUÍ ERROR", exception)
//         return handleException(req, res, exception);
//     }
// }



export const getFileById = async (req, res) => {
    try {
        
        const readStream = await getFileReadStreamData(req.params.id);
        readStream.pipe(res)
             
       const fileInfo = await conn.db.collection('uploads.files').findOne({_id: mongoose.Types.ObjectId(req.params.id)})
     
       
       
      if(fileInfo.contentType.includes('audio')){
          res.set('Connection', 'keep-alive');
          res.set('Accept-Ranges', 'bytes 0-' +fileInfo.length);
          res.set('Content-Length', fileInfo.length);
      }
        
    }catch(exception){
        return handleException(req, res, exception);
    }
}

export const deleteFileById = async (req, res, next) => {
    try {
        if (req.hasFile)
        {
            const session = req.session;
            if (!req.fileId) return res.status(403).json({status: message.statusResponse.ERROR, message:"No file found"})
           
            await gfs.files.deleteOne({
                _id: mongoose.Types.ObjectId(req.fileId)
            },{session});

        }
        
        next()
    }catch(exception){
        return handleException(req, res, exception);
    }
}

