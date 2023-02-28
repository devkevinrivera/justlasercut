import * as path from 'path'

export default (req, res) => {
    if (req.method === 'GET') {
        try {
            res.writeHead(200, {
                'Content-Type': `image/${req.query.filename.split('.').pop()}`,
            })
            res.sendFile(`${process.cwd()}/public/${req.query.filename}`);
        } catch (err) {
            console.log(err)
            res.status(500).json({
                message: 'Error al descargar fichero'
            })
        }
    };
};