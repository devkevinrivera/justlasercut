import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL_MONGO } from '../constants/config';
import moment from "moment";

export default function contactIndexForm(req, res) {
    const { method } = req;
    if (method === 'GET') {
        getPedidos(req, res)
    }

    if (method === 'POST') {
        createPedido(req, res)
    }

    if (method === 'DELETE') {
        deletePedido(req, res)
    }
    if (method === 'PUT') {
        modifyPedido(req, res)
    }
}

const getPedidos = (req, res) => {
    const getMessages = async () => {
        try {
            const client = await MongoClient.connect(BASE_URL_MONGO);
            const db = client.db();
            const collection = db.collection('pedidos');
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

const modifyPedido = ({ body, files, query }, res) => {
    const checkPutMessage = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("pedidos");
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

const deletePedido = ({ body, files, query }, res) => {
    const delMessage = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = await session.db();
            const collection = db.collection("pedidos");
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

const createPedido = ({ body }, res) => {
    const create = async () => {
        try {
            const client = await MongoClient.connect(BASE_URL_MONGO);
            const db = client.db();
            const collection = db.collection("pedidos");

            const pedido = {
                ...body,
                id: uuidv4(),
                date: moment().format('DD-MM-YYYY'),
                revisado: false
            };
            await collection.insertOne(pedido);

            client.close();
            res.status(200).json({
                id: id,
                message: "El pedido se creo correctamente."
            });
        } catch (err) {
            res.status(500);
        }
    }
    create();
};