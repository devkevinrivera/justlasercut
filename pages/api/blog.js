import { MongoClient } from "mongodb";
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;
import { v4 as uuidv4 } from 'uuid';

export default (req, res) => {
    if (req.method === 'POST') {
        console.log(req.body)
        if(!req.body.data) {
            createEntryBlog(req, res)
        } else {
            updateBlocksBlog(req,res)
        }
        
    };
    if (req.method === 'GET') {
        GetEntryBlog(req, res)
    };
    if (req.method === 'PUT') {
        ModifyEntryBlog(req, res)
    };
    if (req.method === 'DELETE') {
        DeleteEntryBlog(req, res)
    };
}

const updateBlocksBlog = ({ body, query }, res) => {
    const editBlog = async () => {
        console.log('ENTRA POR AQUUIIIII')
        try {
            const objectModified = {
                $set: {
                    blocks: body.data,
                }
            };
            const filter = { id: body.id };
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Blog");
            await collection.updateOne(filter, objectModified);

            session.close();
            res.status(200).json({
                message: 'Se a actualizado correctamente el bloque.'
            });
        } catch (err) {
            res.status(500).json({
                message: `Error al actualizar el manual.`
            });
        }
    };
    editBlog();
};

const DeleteEntryBlog = ({ body, query }, res) => {
    const { id } = body;
    const deleteBlog = async () => {
        try {
            const session = await MongoClient.connect(BASE_URL_MONGO);
            const db = session.db();
            const collection = db.collection("Blog");
            await collection.deleteOne({ id: id });

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
    deleteBlog();
};

const ModifyEntryBlog = ({ body, query }, res) => {
    const editBlog = async () => {
        try {
            const objectModified = {
                $set: {
                    ...body
                }
            };
            const filter = { id: query.id };
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Blog");
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
    editBlog();
};

const GetEntryBlog = ({ query }, res) => {
    const getBlog = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Blog");
            let fetchManul;
            let data = 'all'
            fetchManul = await collection.find().toArray();
            session.close();
            res.status(200).json({
                blog: fetchManul
            });
        } catch (err) {
            console.error(`Error al obtener pasos del manual ${err}`);
            res.status(500).json({
                message: 'No se puede obtener el manual de la base de datos.'
            });
        }
    }
    getBlog();
};

const createEntryBlog = ({ body }, res) => {
    const createBlog = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Blog");
            const idCategory = uuidv4();
            const createCategory = await collection.insertOne({
                id: idCategory,
                ...body
            });

            session.close();
            res.status(200).json({
                id: idCategory,
                configurationSite: createCategory
            });
        } catch (err) {
            console.error(`Error al crear un paso del manual ${err}`);
            res.status(500).json({
                error: `No se pudo obtener la configuración del sitio.`
            });
        }
    };
    createBlog();
};




