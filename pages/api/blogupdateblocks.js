import nextConnect from "next-connect";
import middleware from "../../middleware/middleware";
import fs from "fs";
import { BASE_MULTIMEDIA_STORE, BASE_URL } from "../../constants/config";
import * as path from 'path'
import { MongoClient } from "mongodb";
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;
const { v4: uuidv4 } = require('uuid');

const handler = nextConnect();
handler.use(middleware);

handler.post((req, res) => {
    saveImage(req, res)
});

const saveImage = async ({ body, files, query }, res) => {
    const rootDir = path.join(__dirname, '../public/')
    
    try {
        let countFile = 0;
        const filesAdd = [];
     
        for (const file of files.file) {
            const extension = file.path.split('.').pop();
            const idMedia = uuidv4();
            fs.readFile(file.path, function (err, data) {
                fs.writeFile(`${BASE_MULTIMEDIA_STORE}/${`${file.name}`}.${extension}`, data, (err) => {
                    if (err) {
                        console.error(`Error al guardar el fichero: ${err}`)
                    } else {
                        
                        filesAdd.push(`${`${file.name}`}.${extension}`)
                        countFile++;
                    }
                })
            });
            
        }
        
        res.status(200).json({
            message: filesAdd
        });
    } catch (err) {
        console.error(`Error al guardar imagen: ${err}`);
        res.status(500).json({
            message: err
        });
    }
}


export const config = {
    api: {
        bodyParser: false
    }
}

export default handler;