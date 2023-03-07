import { MongoClient } from "mongodb";
const { v4: uuidv4 } = require('uuid');
import { BASE_URL_MONGO } from "../../constants/config";
const url = BASE_URL_MONGO;
import nodemailer from 'nodemailer';


export default function handler(req, res) {
    const { method } = req;

    if (method === 'POST') {
        verifyProject(req, res);
    }
    
		if (method === 'PUT') {
        completeProject(req, res);
    }
}


const mailPedido = (options) => {
	const { idDelivery , creationDate, session, paymentLink, emailsend } = options.item;
	return ({ 
		from: 'justlasercutdev@gmail.com',
		to: emailsend || 'kevinriveradev@gmail.com',
		subject: 'Realiza tu pedido',
		text: 'kevin',
		html: `
		<html>
			<style>
				@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');
				.header{
					background-color: #f1f2f3;
				}
				h1 , p {
					font-family: 'Roboto', sans-serif;
				}
			</style>
			<body>
				<div class="header" style="background-color: #f1f2f3">
						<img src="http://justlasercut.com/wp-content/uploads/2020/02/logo_archicercle.png" />
				</div>
				<h1>¡Gracias por realizar tu pedido con JustlaserCut</h1>

				<p>
					Fecha de validación: ${creationDate}
					<br/>
					Te confirmamos que tu número de pedido es: ${idDelivery} <br/>
					<br/>
					Estas a un paso de completar tu pedido, 
					Para ello tienes que dirigirte al siguiente enlace y realizar el pago."
					<br/>	<br/>
					<a href="${paymentLink}">COMPLETAR PAGO</a>
					<br />
					¡Gracias por elegir JUSTLASERCUT!
					<br/>
					Atentamente,
					Tu equipo de JUSTLASERCUT.
				</p>
			</body>
		</html>
		`
	})
}

const mailBizumEsOptions = (options) => {
	const { idDelivery , creationDate, calculoPrecios, session, paymentLink, emailsend } = options.item;
	return ({ 
		from: 'justlasercutdev@gmail.com',
		to: emailsend || 'kevinriveradev@gmail.com',
		subject: 'Bienvenido a JustlaserCut',
		html: `
		<html>
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');
			.header{
				background-color: #f1f2f3;
			}
			h1 , p {
				font-family: 'Roboto', sans-serif;
			}
		</style>
		<body>
			<div class="header" style="background-color: #f1f2f3">
					<img src="http://justlasercut.com/wp-content/uploads/2020/02/logo_archicercle.png" />
			</div>
			<h1>¡Gracias por realizar tu pedido con JustlaserCut</h1>

			<p>
				Fecha de validación: ${creationDate}
				<br/>
				Te confirmamos que tu número de pedido es: ${idDelivery} <br/>
				<br/>
			</p>
				<p>
					Gracias por usar el servicio de compras online de JustLaserCut.
					Para completar el proceso de compra realiza un bizum al (+34 665 30 69 19). 
				</p>
				<p>
					En el concepto debes validar los 5 primeros digitos del identificador del pedido y tu nombre.
					Una vez nuestro equipo haya validado el pago te enviaremos un email de confirmación de pedido.
				</p>
			<p>
				<br />
				¡Gracias por elegir JUSTLASERCUT!
				<br/>
				Atentamente,
				Tu equipo de JUSTLASERCUT.
			</p>
		</body>
	</html>
		`
	})
}

const completeProject = async ({ body : { id } }, res) => {
  const session = await MongoClient.connect(url);
  const db = session.db();
  const collection = db.collection("pedidos");
  await collection.updateOne({ "idDelivery": id}, { $set: { "verified" : true } },{ upsert: true });
  session.close();
  res.status(200).json({
    message: 'Se a actualizado correctamente.'
  });
}

const verifyProject = ({ body }, res) => {
	const { paymentSelected } = body.item;
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: { 
			user: 'justlasercutdev@gmail.com', 
			pass: '23324123Ff*'
		}
	});
    const fetchResource = async () => {
        try {
						transporter.sendMail(paymentSelected === 0 ? mailPedido(body) : mailBizumEsOptions(body), (x,y) => {
							res.status(200).json({
                message: `Email sent: `, 
            	});
						})
        } catch (err) {
            res.status(500).json({
                message: 'CreatedFail!'
            });
        }
    };
    fetchResource();
};



