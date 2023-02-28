import moment from "moment";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt"
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        getUser(req, res);
    }
    if (method === 'POST') {
        registerUser(req, res)
    }
    if (method === 'PUT') {
        editCustomer(req, res)
    }
}

const editCustomer = (req, res) => {
    const putStep = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection('customers');
            const filter = { id: req.body.id };

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

function getUser(req, res) {
    const fetch = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("customers");
            const request = await collection.find().toArray();

            client.close();
            return res.status(200).json({
                request
            })
        } catch (err) {
            console.log(`Error: ${err}`)
        }
    };
    fetch();
};


function registerUser({ body }, res) {
    const fetch = async () => {
        const { email, password, name, avatar = false } = body;
        const templateUser = {
            id: uuidv4(),
            email: email,
            password: bcrypt.hashSync(password, 10),
            name: name,
            avatar: avatar,
            createdAt: moment().format('DD-MM-YYYY')
        }
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("customers");
            const response = await collection.insertOne(templateUser);
            client.close();
            return res.status(200).json({
                customer: response
            })
        } catch (err) {
            res.status(500)
        }
    }
    fetch();
}