import { MongoClient } from "mongodb";

import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;
import { v4 as uuidv4 } from 'uuid';

export default (req, res) => {
    if (req.method === 'POST') {
        createMachine(req, res)
    };
    if (req.method === 'GET') {
        getMachines(req, res)
    };
    if (req.method === 'PUT') {
        editMachine(req, res)
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
            const collection = db.collection("Maquinas");
            await collection.deleteOne({ idMachine: query.idMachine });

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

const editMachine = ({ body }, res) => {
    const editStepManual = async () => {
        try {
            const objectModified = {
                $set: {
                    ...body
                }
            };
            const filter = { _id: body._id };
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Maquinas");
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

const getMachines = ({ query }, res) => {
    const fetchManualSteps = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Maquinas");
            const fetchMachines = await collection.find().toArray();

            session.close();
            res.status(200).json({
                lista: fetchMachines
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

const createMachine = ({ body }, res) => {
    const fetchInfoConfig = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Maquinas");
            const createManualStep = await collection.insertOne({
                idMachine: uuidv4(),
				active: true,
                ...body
            });
            session.close();

            res.status(200).json({
                message: 'Creado correctamente'
            });
        } catch (err) {
            console.error(`Error al crear maquina: ${err}`);
            res.status(500).json({
                error: `Error al crear maquina: ${err}`
            });
        }
    };
    fetchInfoConfig();
};




