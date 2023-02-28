import moment from "moment";
import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        getSiteSteps(req, res);
    }
    if (method === 'POST') {
        createStep(req, res);
    }
    if (method === 'PUT') {
        editStep(req, res);
    }
    if (method === 'DELETE') {
        deleteStep(req, res);
    }
}

const deleteStep = (req, res) => {
    const stepDelete = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("Steps");
            const filter = { idStep: req.query.id };
            await collection.deleteOne(filter);

            session.close();
            res.status(200).json({
                message: 'DeletedSuccesfully'
            })
        } catch (error) {

            res.status(500).json({
                message: 'DeleteFailed!'
            });
        }
    }
    stepDelete();
};

const getSiteSteps = async (req, res) => {
    try {
        const session = await MongoClient.connect(BASE_URL_MONGO);
        const db = session.db();
        const collection = db.collection("Steps");
        const getCollection = await collection.find().toArray();

        session.close();
        res.status(200).json({
            message: 'GetSuccesfully!',
            steps: getCollection
        })
    } catch (err) {
        console.error(`Error al obtener los pasos. ${err}`);

    }
};

const editStep = (req, res) => {
    const putStep = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection('Steps');
            const filter = { idStep: req.query.id };
            const stepUpdated = {
                $set: {
                    ...req.body
                }
            }
            await collection.updateOne(filter, stepUpdated);

            session.close();
            res.status(200).json({
                message: 'ModifiedSuccesfully!'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: error
            });
        }
    };
    putStep();
}

const createStep = ({ body }, res) => {
    const fetchSteps = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("Steps");
            await collection.insertOne({
                ...body,
            });

            session.close();
            res.status(200).json({
                message: 'CreatedSuccesfully!'
            });
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'CreatedFail!'
            });
        }
    };
    fetchSteps();
};
