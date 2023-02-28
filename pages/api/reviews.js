import moment from "moment";
import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        getAllReviews(req, res);
    }
    if (method === 'POST') {
        createReview(req, res)
    }
    if (method === 'DELETE') {
        deleteReview(req, res)
    }
    if (method === 'PUT') {
        editReview(req, res)
    }
}

async function editReview(req, res) {
    try {
        const client = await MongoClient.connect(url);
        const db = client.db();
        const collection = db.collection("reviews");

        const filter = { id: req.query.id }
        const objectModified = {
            $set: {
                ...req.body
            }
        };
        const update = await collection.updateOne(filter, objectModified);

        client.close();
        res.status(200).json({
            message: 'Se actualizo correctamente.'
        })
    } catch (err) {

    }
};

function createReview({ body }, res) {
    const create = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("reviews");
            const fetchReview = await collection.insertOne({
                ...body,
                show: true
            });

            client.close();
            return res.status(200).json({
                message: 'Review creada correctamente',
                created: fetchReview
            });
        } catch (err) {
            console.error(`Error al crear review: ${err}`)
            return res.status(500).json({
                message: `Error al crear review: ${err}`
            });
        }
    };
    create();
};



function deleteReview(req, res) {
    const deletes = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("reviews");
            const fetchReview = await collection.deleteOne({
                id: req.query.id
            });

            client.close();
            return res.status(200).json({
                message: 'Review borrada correctamente',
                created: fetchReview
            });
        } catch (err) {
            console.error(`Error al crear review: ${err}`)
            return res.status(500).json({
                message: `Error al crear review: ${err}`
            });
        }
    };
    deletes();
};

function getAllReviews({ body }, res) {
    const { email } = body;
    const fetch = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("reviews");
            const request = await collection.find().toArray();

            client.close();
            return res.status(200).json({
                list: request
            })
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    };
    fetch();
};

