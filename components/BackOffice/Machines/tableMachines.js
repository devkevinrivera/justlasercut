import React , { useEffect } from 'react';
import { Table , Icon, Button } from "semantic-ui-react";
import ModalMachine from './ModalMachine';
import { useMachine } from "../../../hooks/useMachine";

const TableMachines = ({ options }) => {
	const { deleteMachine , getAllMachines } = useMachine();

	return (
		<Table>
			<Table.Header>
				<Table.Row>
					<Table.HeaderCell>Estado</Table.HeaderCell>
					<Table.HeaderCell>Nombre</Table.HeaderCell>
					<Table.HeaderCell>Ancho maximo</Table.HeaderCell>
					<Table.HeaderCell>Alto maximo</Table.HeaderCell>
					<Table.HeaderCell>
						<ModalMachine />
					</Table.HeaderCell>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{
					options?.map((item) => {
						const {
							active,
							maxWidth,
							maxHeight,
							name, 
							idMachine
						} = item;
						return (
							<Table.Row>
								<Table.Cell>
									<Icon 
										name={active ? 'check' : 'x'} 
										color={active ? 'green' : 'red'}
									/>
								</Table.Cell>
								<Table.Cell>{name}</Table.Cell>
								<Table.Cell negative>{maxWidth}</Table.Cell>
								<Table.Cell negative>{maxHeight}</Table.Cell>
								<Table.Cell negative>
									<ModalMachine edit objectEdit={item}/>
									<Button color="red" onClick={() =>{ 
										deleteMachine(item.idMachine)
									}} className="button-modal-icon">
										<Icon name="trash alternate" />
									</Button>
								</Table.Cell>
							</Table.Row>
						)})
				}
			</Table.Body>
		</Table>
	);
};

export default TableMachines;