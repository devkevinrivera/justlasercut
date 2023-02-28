import moment from "moment";
import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handlerServices(req, res) {
    const { method } = req;

    if (method === 'GET') {
        getStepsServices(req, res);
    }
    if (method === 'POST') {
        createStepService(req, res);
    }
    if (method === 'PUT') {
        editStepService(req, res);
    }
    if (method === 'DELETE') {
        deleteStepService(req, res);
    }
}

const deleteStepService = ({ query }, res) => {
    const deleteDocument = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("Services");
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

const editStepService = ({ body }, res) => {
    const editService = async () => {
        try {
            const {
                title,
                image,
                video,
                order,
                description,
                buttons,
                language,
                step
            } = body;
            const objectModified = {
                $set: {
                    ...body
                }
            };
            const filter = { id: step };
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Services");
            await collection.updateOne(filter, objectModified);

            session.close();
            res.status(200).json({
                message: 'Se a actualizado correctamente.'
            })
        } catch (err) {
            console.error(`Error al actualizar paso del manual: ${err}`)
            res.status(500).json({
                message: `Error al actualizar el manual.`
            })
        }
    };
    editService();
};

const getStepsServices = ({ query }, res) => {
    const fetchManualSteps = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Services");
            let fetchManul;
            if (query?.language !== 'all') {
                fetchManul = await collection.find({ language: query.language }).toArray();
            } else {
                fetchManul = await collection.find().toArray();
            }
            const listOrdered = fetchManul.sort((a, b) => a.order - b.order);

            session.close();
            res.status(200).json({
                services: listOrdered
            });
        } catch (err) {
            res.status(500).json({
                message: 'No se puede obtener los servicios de la base de datos.'
            });
        }
    }
    fetchManualSteps();
};

const createStepService = ({ body }, res) => {
    const fetchInfoConfig = async () => {
        try {
            const { title = '', image = '', video = '', order = '', description = '', buttons = {}, language = 'es', id } = body;
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Services");
            const serviceId = id;
            const createServiceStep = await collection.insertOne({
                id: serviceId,
                title,
                image,
                video,
                order,
                description,
                buttons,
                language
            });

            session.close();
            res.status(200).json({
                id: serviceId
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





