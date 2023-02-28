import moment from "moment";
import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default function handler(req, res) {
    const { method } = req;

    if (method === 'GET') {
        getSiteProps(req, res);
    }
    if (method === 'POST') {
        ConfigSiteProps(req, res);
    }
    if (method === 'PUT') {
        updateConfigSite(req, res);
    }
}

const getSiteProps = ({ body }, res) => {
    const fetchInfoConfig = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("site");
            const createConfig = await collection.find().toArray();

            session.close();
            res.status(200).json({
                configurationSite: createConfig
            });
        } catch (err) {
            console.error(`Error al intentar obtener las propiedades del sitio`);
            res.status(500).json({
                error: `No se pudo obtener la configuración del sitio.`
            });
        }
    };
    fetchInfoConfig();
};

const ConfigSiteProps = ({ body }, res) => {
    const fetchConfiguration = async () => {
        try {
            const client = await MongoClient.connect(url);
            const db = client.db();
            const collection = db.collection("site");
            await collection.deleteMany({});
            await collection.insertOne({
                ...body,
                id :'0001',
            });

            client.close();
            res.status(200).json({
                message: 'Configuracion iniciada'
            })
        } catch (err) {
            console.error(`Error al configurar variables del sitio: ${err}`)
            res.status(500).json({
                message: 'No se puede guardar la configuracion.'
            })
        }
    }
    fetchConfiguration();
}

const updateConfigSite = ({ body }, res) => {
    const updateInfo = async () => {
        try {
            const { sitename = '', email, maintance, phone } = body;
            const site = await MongoClient.connect(url);
            const db = site.db();
            const collection = db.collection('site');
            await collection.deleteMany();
            const updateInformation = await collection.updateMany(
                { id: '0001' },
                {
                    $set: {
                        id: '0001',
                        sitename: sitename,
                        email: email,
                        maintance: maintance,
                        phone: phone.replace(' ', ''),
                        GoogleApiDeveloper: '',
                        FacebookApiDeveloper: ''
                    }
                },
                { upsert: true }
            )

            site.close();
            res.status(200).json({
                'message': `Se actualizo correctamente. ${updateInformation}`
            })
        } catch (err) {
            console.error(`Error al actualizar la información: ${err}`)
            res.status(500).json({
                'message': `La actualizacion fallo. ${err}`
            })
        }
    };
    updateInfo();
};

