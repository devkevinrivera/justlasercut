import middleware from "../../middleware/middleware";
import nextConnect from 'next-connect'
import fs from "fs";

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
    let file = __dirname + '/' + req.files.data[0].originalFilename;
    try {
        fs.readFile(req.files.data[0].path, function (err, data) {
            fs.writeFile(`uploads/${req.files.data[0].originalFilename}`, data, function (err) {
                if (err) {
                    console.error(`Error al guardar fichero: ${err}`)
                } else {
                    res.status(200).json({
                        message: 'Todo creado correctamente.'
                    })
                }
            })
        })
    } catch (err) {
        console.error(`Error de subida: ${err}`)
    }

})

export const config = {
    api: {
        bodyParser: false
    }
}

export default handler