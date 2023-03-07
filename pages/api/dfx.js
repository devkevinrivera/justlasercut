import nextConnect from "next-connect";
import middleware from "../../middleware/middleware";
import fs from "fs";
import { BASE_URL } from "../../constants/config";
import * as path from 'path';

const handler = nextConnect();
handler.use(middleware);

handler.post((req, res) => {
    saveDxf(req, res)
});

const saveDxf = ({ body, files, query }, res) => {
    const rootDir = path.join(__dirname, '..')
    try {
        fs.readFile(files.file[0].path, function (err, data) {
            fs.writeFile(`C:/Users/Administrator/Documents/justlasercut/justlasercut/LaserCutApp/test/${query.id}.dxf`, data, (err) => {
                if (err) {
                    console.error(`Error al guardar el fichero: ${err}`)
                } else {
                    res.status(200).json({
                        message: `${query.id}.dxf`
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