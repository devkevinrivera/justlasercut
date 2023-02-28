import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default (req, res) => {
    if (req.method === 'POST') {
        validateAdministrator(req, res)
    };
}

const validateAdministrator = ({ body }, res) => {
		const { token } = body;
    
		const fetchManualSteps = async () => {
        try {
            const session = await MongoClient.connect(url);
            const db = session.db();
            const collection = db.collection("Admin");
            const fetchAdmins = await collection.find().toArray();

						const exist = fetchAdmins.find(admin => admin.token === token)
						
            session.close();
            res.status(200).json({
                valid: exist ? true : false
            });
        } catch (err) {
            res.status(500).json({
                message: 'No se puede obtener el manual de la base de datos.'
            });
        }
    }
    fetchManualSteps();
};





