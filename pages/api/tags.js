import moment from "moment";
import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        getTags(req, res);
    }
    if (method === 'POST') {
        createTag(req, res)
    }
    if (method === 'DELETE') {
        deleteTag(req, res)
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

function createTag({ body }, res) {
    const create = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("Tags");
            const fetchReview = await collection.insertOne({
                ...body,
				idTag: uuidv4()
            });

            client.close();
            return res.status(200).json({
                message: 'Tag creado correctamente',
                created: fetchReview
            });
        } catch (err) {
            console.error(`Error al tag: ${err}`)
            return res.status(500).json({
                message: `Error al crear review: ${err}`
            });
        }
    };
    create();
};



function deleteTag(req, res) {
    const deletes = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("Tags");
            const fetchReview = await collection.deleteOne({
                idTag: req.query.idTag
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

function getTags({ body }, res) {
    const fetch = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("Tags");
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

