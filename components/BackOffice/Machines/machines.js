import React , { useEffect } from 'react';
import { Container, Grid, Header, Divider, Button } from "semantic-ui-react";
import TableMachines from "./tableMachines";
import ModalMachine from "./ModalMachine";
import { useMachine } from "../../../hooks/useMachine";

const Machines = () => {
	const { list, getAllMachines } = useMachine();

	useEffect(() => {
		getAllMachines()
	},[]);
	
	return (
		<>
			<Grid columns={16} className="machines-container">
				<Grid.Row>
					<Grid.Column computer={16}>
						<Header as="h2">
							ADMINISTRACIÓN DE MAQUINAS
						</Header>
					</Grid.Column>
				</Grid.Row>
				<Divider/>
				<Grid.Row>
					<Grid.Column computer={16}>
						<TableMachines options={list} />
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</>
	);
};

export default Machines;