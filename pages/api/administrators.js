import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;

export default (req, res) => {
    if (req.method === 'POST') {
        validateAdministrator(req, res)
    };
}

const ADMINISTRATORS = [
    {
        username: 'kevin',
        password: '1234'
    },
    {
        username: 'pablo',
        password: 'SMDSxdcds43'
    },
    {
        username: 'justlasercut',
        password: 'JUSTLASERCUT2020'
    }
]
const validateAdministrator = ({ body }, res) => {
		const { email , password } = body;
    
		const fetchManualSteps = async () => {
        try {
            let findUserAdmin = ADMINISTRATORS.find(
                user => user.username === email && user.password === password
            );
            res.status(200).json({
                token: findUserAdmin ? JSON.stringify(findUserAdmin) : null
            });
        } catch (err) {
            console.error(`Error al obtener pasos del manual ${err}`);
            res.status(500).json({
                message: 'No se puede  base de datos.'
            });
        }
    }
    fetchManualSteps();
};





