import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form"
import router, { useRouter } from 'next/router';
import { Button, Header, Image, Modal, Divider, Grid, Input } from 'semantic-ui-react'
import { usePedidos } from "../../../hooks/usePedidos";
import ModalPedidoTecnicalInfo from "./PedidoTecnicalInfo";

const ModalVerifyPedidos = ({ item , verified }) => {
	const [open,setOpen] = useState(false);
	const [link,setLink] = useState('');
	const { 
		creationDate , 
		informacionPedido, 
		calculoPrecios, 
		informacionEnvio = {
			delivery : { 
				carrier_name: ''
			}
		},  
		session, 
		paymentSelected } = item;
	
	const { validatePedido } = usePedidos();
	const { 
		address, 
		addressComplement,
		name, 
		lastname ,
		phone ,
		delivery
	 } = informacionEnvio;
	 
	 const getPaymentMethod = (paymentSelected) => {
		if (paymentSelected === 0) {
			return 'Targeta'
		}
		if (paymentSelected === 1) {
			return 'Bizum'
		}
	 };

	 return (
		<Modal
			onClose={() => setOpen(false)}
			onOpen={() => setOpen(true)}
			open={open}
			className="modal-delivery"
			trigger={<Button size="mini" primary>validar</Button>}
    >
			<Modal.Header className="modal-delivery__header">
				<div>
					<p>{creationDate}</p>
				</div>
				<div>
					<p><b>Subtotal: {calculoPrecios?.subtotal} €</b></p>
				</div>
			</Modal.Header>
			
			<Modal.Content>
          <div className="modal-delivery__infopedido">
						<h3>Información del cliente</h3>
						<p>
							<b>Nombre: {name + ' ' + lastname}</b>
							<b>Id del pedido: {item?.idDelivery}</b>
							<b>Email: {'kevinriveradev@gmail.com'}</b>
							<b>Direccion: {address + ' / ' + addressComplement}</b>
							<b>Telefono: {phone || 'Incompleto'}</b>
							<b>Metodo de pago: {getPaymentMethod(paymentSelected)}</b>
						</p>
					</div>
					<Divider />
					<div className="modal-delivery__items">
						<h3>Información del pedido: </h3>
						<Grid columns="16">
							{
								informacionPedido?.items?.map(item => 
									<DeliveryItem item={item} />
								)
							}
						</Grid>
					</div>
					{
						paymentSelected === 0 && (
							<>
							<Divider />
							<Grid.Column computer={16}>
								<h5>Pega el enlace de pago:</h5>
								<Input 
									fluid 
									placeholder="Enlace de pago" 
									value={link} 
									onChange={ev => setLink(ev.target.value)} 
								/>
							</Grid.Column>
							</>
						)
					}
					
      </Modal.Content>
			<Modal.Actions>
					<Button color='black' onClick={() => setOpen(false)}>
            Cancelar
          </Button>
					<Button
            content="Validar pedido"
            labelPosition='right'
            icon='checkmark'
						onClick={() => {
							validatePedido({
								item: {
									...item,
									paymentLink: link,
									emailsend: 'kevinriveradev@gmail.com'
								}
							});
							setOpen(false);
							setLink('');
						}}
            style={{ backgroundColor: '#CC555F', color: 'white' }}
          />
      </Modal.Actions>
		</Modal>
	);
};

const DeliveryItem = ({ item }) => {
	const { copias , file , extras, total, weight, material } = item;
	const { errorList } = file;
	const { getMaterial , materialDelivery } = usePedidos();

	useEffect(() => {
		getMaterial(material);
	},[]);

	return (
		<Grid.Row>
			<Grid.Column computer={8}>
				<p><b>Total:</b> {parseInt(total)} €</p>
				<p><b>Copias:</b> {copias}</p>
				<p><b>Planchas:</b> {file.planchas.length}</p>
				<p><b>Grosor:</b> {weight}mm</p>
				<p>
					<b>Material:</b>{materialDelivery?.title?.es} - {` `}
					<ModalPedidoTecnicalInfo pedido={item} />
				</p>
				<p><b>Material propio:</b> {file.materialClient ? 'Si' : 'No'}</p>
			</Grid.Column>
			<Grid.Column computer={8}>
				<h5>Extras:</h5>
				{
					extras.map((extra,index) => (
						<p>{index}-{extra.text}</p>
					))
				}
			</Grid.Column>
		
			<Grid.Column computer={8}>
				<Image src={file.previsualization} />
			</Grid.Column>

			<Grid.Column computer={8}>
				<h5>Errores detectados:</h5>
				{
					errorList.map((error,index) => (
						<p>-{error}</p>
					))
				}
			</Grid.Column>
			
		</Grid.Row>
	)
};

export default ModalVerifyPedidos;