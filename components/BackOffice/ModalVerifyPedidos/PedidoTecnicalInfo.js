import React , { useState , useEffect } from 'react'
import { Button, Container, Header, Image, Modal, Table, Divider, Grid } from 'semantic-ui-react'
import { useMaterial } from "../../../hooks/useMaterial";

function ModalPedidoTecnicalInfo({ pedido }) {
  const [open, setOpen] = useState(false)
	const { file: { planchas} , material : materialId} = pedido;
	const { list , getMaterialList} = useMaterial();
	const [materialSelected,setMaterialSelected] = useState();

	console.log('Modal pedido Pedido');
	console.log(list);

	useEffect(() => {
		getMaterialList();
	},[]);
	
	useEffect(() => {
		if(!list?.length) return;

		const find = list.find(material => material.id === materialId);
		setMaterialSelected(find);
	},[list]);
	
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
				<Button size="mini" secondary>
					Ver información tecnica
				</Button>
			}
			style={{ 
				padding: '1rem'
			}}
    >
      <Modal.Header>Revisión de pedido</Modal.Header>
			<Container>
			<Grid columns="16">
				<Grid.Row>
					<Grid.Column computer={16}>
						<Table>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Indice</Table.HeaderCell>
									<Table.HeaderCell>Tamaño</Table.HeaderCell>
									<Table.HeaderCell>Capas detectadas</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
									{
										planchas.map((plancha,index) => (
											<Table.Row>
												<Table.Cell>
													{index}
												</Table.Cell>
												<Table.Cell>
													{plancha.board.width} x {plancha.board.height} mm
												</Table.Cell>
												<Table.Cell>
													{
														plancha?.capas?.map((capa) => (
															<p>{capa.type} : {capa.longitud}mm</p>
														))
													}
												</Table.Cell>
											</Table.Row>
										))
									}
							</Table.Body>
						</Table>
					</Grid.Column>
					<Grid.Column computer={16}>
						<Divider />
						{console.log(materialSelected)}
						<Header>Información de corte del ({materialSelected?.title?.es}):</Header>
						<Table>
							<Table.Header>
								<Table.Row>
									<Table.HeaderCell>Tipo capa</Table.HeaderCell>
									<Table.HeaderCell>Velocidad</Table.HeaderCell>
									<Table.HeaderCell>Potencia</Table.HeaderCell>
									<Table.HeaderCell>Resolución</Table.HeaderCell>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell>Corte interior</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport?.insideCut.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport?.insideCut.power}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Corte exterior</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.outsideCut.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.outsideCut.power}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Corte linea (Bajo)</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.lowEngraving.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.lowEngraving.power}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Corte linea (Medio)</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.mediumEngraving.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.mediumEngraving.power}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Corte linea (Alto)</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.hightEngraving.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.hightEngraving.power}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Grabado relleno (Bajo)</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.lowFillEngraving.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.lowFillEngraving.power}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.lowFillEngraving.resolution}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Grabado relleno (Medio)</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.mediumFillEngraving.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.mediumFillEngraving.power}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.mediumFillEngraving.resolution}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell>Grabado alto (Alto)</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.hightFillEngraving.velocity}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.hightFillEngraving.power}</Table.Cell>
									<Table.Cell>{materialSelected?.cuttingReport.hightFillEngraving.resolution}</Table.Cell>
									<Table.Cell></Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table>
					</Grid.Column>
				</Grid.Row>
			</Grid>
			</Container>
      <Modal.Content image>
        {/* <Image size='medium' src='/images/avatar/large/rachel.png' wrapped />
        <Modal.Description>
          <Header>Default Profile Image</Header>
          <p>
            We've found the following gravatar image associated with your e-mail
            address.
          </p>
          <p>Is it okay to use this photo?</p>
        </Modal.Description> */}
				
				
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          Cerrar
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ModalPedidoTecnicalInfo
