import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handler(req, res) {
    const { method } = req;
    const { users = false } = req.body;

    if (method === 'GET') {
        getUser(req, res);
    }
    if (method === 'POST') {
        getUsers(req, res)
    }
}


function getUser({ body }, res) {
    const { email } = body;
    const fetch = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("customers");
            const request = await collection.findOne({ email });
            client.close();
            return res.status(200).json({
                request
            });
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    };
    fetch();
};

function getUsers({ body }, res) {
    const fetch = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("customers");
            const request = await collection.find().toArray();

            const filteredList = request.map(({ name, avatar, email }) => ({
                name, avatar, email
            }));

            client.close();
            return res.status(200).json({
                users: filteredList
            })
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    };
    fetch();
};
