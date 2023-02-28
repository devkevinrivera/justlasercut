import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default (req, res) => {
    if (req.method === 'POST') {
        createStepManualStep(req, res)
    };
    if (req.method === 'GET') {
        getStepsManual(req, res)
    };
    if (req.method === 'PUT') {
        editStepManual(req, res)
    };
    if (req.method === 'DELETE') {
        deleteStepManual(req, res)
    };
}

const deleteStepManual = ({ query }, res) => {
    const deleteDocument = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("Manual");
            await collection.deleteOne({ id: query.id });

            session.close();
            res.status(200).json({
                message: 'Eliminado correctamente.'
            })
        } catch (error) {
            res.status(500).json({
                message: `Error al eliminar el manual: ${err}`
            })
        }
    };
    deleteDocument();
};

const editStepManual = ({ body }, res) => {
    const editStepManual = async () => {
        try {
            const objectModified = {
                $set: {
                    ...body
                }
            };
            const filter = { id: body.step };
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Manual");
            await collection.updateOne(filter, objectModified);

            session.close();
            res.status(200).json({
                message: 'Se a actualizado correctamente.'
            });
        } catch (err) {
            res.status(500).json({
                message: `Error al actualizar el manual.`
            });
        }
    };
    editStepManual();
};

const getStepsManual = ({ query }, res) => {
    const fetchManualSteps = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Manual");
            let fetchManul;
            if (query?.language !== 'all') {
                fetchManul = await collection.find({ language: query.language }).toArray();
            } else {
                fetchManul = await collection.find().toArray();
            }
            const listOrdered = fetchManul.sort((a, b) => a.order - b.order);

            session.close();
            res.status(200).json({
                steps: listOrdered
            });
        } catch (err) {
            console.error(`Error al obtener pasos del manual ${err}`);
            res.status(500).json({
                message: 'No se puede obtener el manual de la base de datos.'
            });
        }
    }
    fetchManualSteps();
};

const createStepManualStep = ({ body }, res) => {
    const fetchInfoConfig = async () => {
        try {
            const { title = '', image = '', video = '', order = '', description = '', buttons = {}, id } = body;
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Manual");
            const idManualStep = id;
            const createManualStep = await collection.insertOne({
                id: idManualStep,
                title,
                image: `${image}`,
                video: `${image}`,
                order,
                description,
                buttons,
                language: body.language
            });

            session.close();
            res.status(200).json({
                id: idManualStep,
                configurationSite: createManualStep
            });
        } catch (err) {
            console.error(`Error al crear un paso del manual ${err}`);
            res.status(500).json({
                error: `No se pudo obtener la configuración del sitio.`
            });
        }
    };
    fetchInfoConfig();
};




