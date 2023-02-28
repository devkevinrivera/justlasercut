import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';

import { BASE_URL_MONGO } from "../../constants/config";
import moment from "moment";

export default function contactIndexForm(req, res) {
    const { method } = req;
    if (method === 'GET') {
        getMessages(req, res)
    }

    if (method === 'POST') {
        createMessage(req, res)
    }

    if (method === 'DELETE') {
        deleteMessage(req, res)
    }
    if (method === 'PUT') {
        checkMessage(req, res)
    }
}

const getMessages = (req, res) => {
    const getMessages = async () => {
        try {
            const client = await MongoClient.connect(BASE_URL_MONGO);
            const db = client.db();
            const collection = db.collection('messages');
            const messages = await collection.find().toArray();

            client.close();
            res.status(200).json({
                messagesList: messages
            })
        } catch (err) {
            res.status(500).json({
                message: 'Error en el servidor'
            });
        }
    };
    getMessages();
};

const checkMessage = ({ body, files, query }, res) => {
    const checkPutMessage = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("messages");
            const filter = { idMessage: query.idMessage };
            const objectModified = {
                $set: {
                    isRead: body.readStatus,
                }
            };
            await collection.updateOne(filter, objectModified);

            session.close();
            res.status(200).json({
                message: `Editado correctamente.`
            })
        } catch (err) {
            console.error(`Error al borrar mensaje: ${err}`);
            res.status(500).json({
                message: `Algo a fallado al borrar.`
            })
        }
    };
    checkPutMessage();
};

const deleteMessage = ({ body, files, query }, res) => {
    const delMessage = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = await session.db();
            const collection = db.collection("messages");
            const delResponse = await collection.deleteOne({ idMessage: query.idMessage });

            session.close();
            res.status(200).json({
                message: `Borrado correctamente.`
            })
        } catch (err) {
            console.error(`Error al borrar mensaje: ${err}`);
            res.status(500).json({
                message: `Algo a fallado al borrar.`
            })
        }
    };
    delMessage();
};

const createMessage = ({ body }, res) => {
    const { email, numberRef = 0, subject, message, id, filename = '' } = body;
    const fetchMessage = async () => {
        try {
            const client = await MongoClient.connect(BASE_URL_MONGO);
            const db = client.db();
            const collection = db.collection("messages");

            const templateMessage = {
                idMessage: id,
                email,
                numberRef,
                subject,
                message,
                date: moment().format('DD-MM-YYYY'),
                isRead: false,
                filename
            };
            await collection.insertOne(templateMessage);

            client.close();
            res.status(200).json({
                id: id,
                message: "El mensaje se envio correctamente."
            });
        } catch (err) {
            res.status(500);
        }
    }
    if (email && subject && message) {
        fetchMessage();
    } else {
        res.status(400).json({
            message: 'Falta información.'
        })
    }

};