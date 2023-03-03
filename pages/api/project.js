import fs from "fs";
import { MongoClient } from "mongodb";
import { BASE_URL_MONGO } from "../../constants/config";
import { v4 as uuidv4 } from 'uuid';
const child = require('child_process').execFile;
const dxf = require('dxf');
export default (req, res) => {
    if (req.method === 'POST') {
        handlerUploadFile(req, res);
    }
}

const handlerUploadFile = async ({ body }, res) => {
    const { fileName, originalName } = body;
    try {
        fs.writeFile('./LaserCutApp/file.txt', fileName, (err) => {
            if (err) throw err;
            let executablePath = "C:/Users/Administrator/Documents/justlasercut/justlasercut/public/LaserCutApp/bin/Debug/LaserCutApp.exe";

            child(executablePath, async function (err, data) {
                console.log('=======================');
                console.log(data);
                console.log('=======================');
                const messagesExceptions = ["Insert\r", "\r", "Point\r"];
                const canPass = ["BOARD", "TYPE", "PLANCHA", "PLANCHA"];
                const filterMessages = data.split('\n').filter((str) => !messagesExceptions.includes(str))
                const filter = filterMessages.filter((str) => str.includes('BOARD') || str.includes('TYPE') || str.includes('ERR') || str.includes('PLANCHA'))

                let planchas = []
                let object = {
                    board: '',
                    capas: [],
                    errorList: []
                }
                const errorList = [];

                filter.map((message, index) => {
                    console.log('mensaje:',message)
                    if(message.includes('ERR')) {
                        errorList.push(message);
                    };

                    if (message.includes('BOARD')) {
                        const messageConvertToArray = message.split('-');
                        object.board = {
                            width: parseFloat(messageConvertToArray[1]),
                            height: parseFloat(messageConvertToArray[2]),
                            numberBoards: parseFloat(messageConvertToArray[3]),
                        };
                    };

                    if (message.includes('TYPE')) {
                        if (message.includes('Corte exterior')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };
                        if (message.includes('Corte interior')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };
                        if (message.includes('Grabado linea bajo')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };
                        if (message.includes('Grabado linea medio')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };
                        if (message.includes('grabado linea alto')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };
                        if (message.includes('Grabado relleno')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };
                        if (message.includes('Grabado superficie')) {
                            const messageConvertToArray = message.split('-');
                            const layer = {
                                type: messageConvertToArray[1],
                                longitud: messageConvertToArray[2],
                                nodes: messageConvertToArray[3]
                            };
                            object.capas.push(layer);
                        };

                    }
                    if (message.includes('PLANCHA')) {
                        planchas.push(object)
                        object = {
                            planchaProperties: '',
                            capas: []
                        }
                    }
                });
                console.log(object)
                let projectItem561 = {
                    planchas: planchas
                };
                try {
                    const session = await MongoClient.connect(BASE_URL_MONGO);
                    const db = session.db();
                    const collection = db.collection("ProjectItem");
                    const idItem = uuidv4();
                    const ProjectItem = await collection.insertOne({
                        fileName: fileName,
                        id: idItem,
                        planchas: planchas,
                        errorList: errorList
                    });

                    session.close();
                    const path = `C:/Users/Administrator/Documents/justlasercut/justlasercut/LaserCutApp/test/${fileName}`
                    const parsed = dxf.parseString(fs.readFileSync(path, 'utf-8'))
                    const svg = dxf.toSVG(parsed);
                    fs.writeFile(`C:/Users/Administrator/Documents/justlasercut/justlasercut/public/${fileName.replace('.dxf','.svg')}`,svg,'utf-8');
                    res.status(200).json({
                        fileName: fileName,
                        id: idItem,
                        planchas: planchas,
                        previsualization: `${fileName.replace('.dxf','.svg')}`,
                        originalName: originalName,
                        errorList: errorList
                    });
                } catch (error) {
                    console.log('Error en sesion', error)
                }

            });

        })
    } catch (err) {
        console.error(`Error al escribir fichero`);
        res.status(500).json({
            message: 'Error al escribir el fichero'
        })
    }

};