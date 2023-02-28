import { MongoClient } from "mongodb";
import { BASE_URL_MONGO } from "../../constants/config";
import { v4 as uuidv4 } from 'uuid';

export default (req, res) => {
    if (req.method === 'POST') {
        createBanner(req, res);
    }
    if (req.method === 'GET') {
        getBanner(req, res);
    }
    if (req.method === 'PUT') {
        putBanner(req, res);
    }
}

const putBanner = async (req, res) => {
    try {
        const session = await MongoClient.connect(BASE_URL_MONGO);
        const db = session.db();
        const collection = db.collection('Banner');
        const filter = { idBanner: req.query.id };
        const modified = {
            $set: {
                ...req.body
            }
        }

        const modifiedResult = await collection.updateOne(filter, modified);
        res.status(200).json({
            result: modifiedResult === null ? [] : modifiedResult
        });
    } catch (error) {
        res.status(500).json({
            error: `Error: ${error}`
        });
    }
};

const getBanner = async (req, res) => {
    try {
        const session = await MongoClient.connect(BASE_URL_MONGO);
        const db = session.db();
        const collection = db.collection('Banner');

        const banner = await collection.find().toArray();

        session.close();
        res.status(200).json({
            response: banner
        });
    } catch (error) {
        res.status(500).json({
            response: `Error: ${error}`
        });
    }
};

const createBanner = async (req, res) => {
    try {
        const id = uuidv4();
        const session = await MongoClient.connect(BASE_URL_MONGO);
        const db = session.db();
        const collection = db.collection('Banner');
        await collection.insertOne({
            ...req.body,
            idBanner: id,
        });

        session.close();
        res.status(200).json({
            banner: { ...req.body, id: id }
        });
    } catch (error) {
        res.status(500).json({
            error: `Error: ${error}`
        });
    }
};