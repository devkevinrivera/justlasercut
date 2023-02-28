import nextConnect from "next-connect";
import middleware from "../../middleware/middleware";
import fs from "fs";
import { BASE_MULTIMEDIA_STORE, BASE_URL } from "../../constants/config";
import * as path from 'path'

const handler = nextConnect();
handler.use(middleware);

handler.post((req, res) => {
    saveImage(req, res)
});

const saveImage = ({ body, files, query }, res) => {
    const rootDir = path.join(__dirname, '../public/')
    const extension = files.file[0].path.split('.').pop();
    try {
        fs.readFile(files.file[0].path, function (err, data) {
            fs.writeFile(`${BASE_MULTIMEDIA_STORE}${query.id}.${extension}`, data, (err) => {
                if (err) {
                    console.error(`Error al guardar el fichero: ${err}`)
                } else {
                    console.log(res)
                    res.status(200).json({
                        message: 'Archivo subido correctamente.'
                    });
                }
            })
        })
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