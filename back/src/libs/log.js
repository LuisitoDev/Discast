import fs from 'fs'


export const writeLog = (message) =>{ 
    const date = new Date();
    fs.appendFile('logs.txt',`[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${message} \n` ,(err)=> {
        if (err) return console.log(err);
    });
}

