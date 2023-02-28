import React, { useEffect, useState } from 'react'
import { Button, Form, Header, Image, Modal, Divider, Input, Table, Icon } from 'semantic-ui-react'
import { useFormik } from "formik";
import { useTermination } from "../../../hooks/useTermination";

function CreationTerminationModal() {
    const [open, setOpen] = useState(false);
		const { createTermination, getTermination, deleteTermination, list } = useTermination();
		const { values , handleSubmit, setFieldValue, resetForm } = useFormik({
			initialValues: {
				titleEs: '',
				titleEn: '',
			},
			onSubmit: values => {
				createTermination(values);
				setOpen(false);
				resetForm();
			},
		});

		useEffect(() => {
			getTermination();
		},[open]);
		
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
						className="creation-tag-modal"
            trigger={<Button primary>+ Añadir acabados</Button>}
        >
            <Modal.Header>Formulario de creación de acabados</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form onSubmit={handleSubmit}>
											<div className="creation-tag-modal__container-values">
												<div className="creation-tag-modal__field">
													<span>Titulo del acabado (ES)</span>
													<Input
														values={values.titleEs}
														onChange={(ev) => {
															console.log(ev.target.value)
															setFieldValue('titleEs',ev.target.value)
														}} 
														placeholder="Titulo de la etiqueta" />
												</div>
												<div className="creation-tag-modal__field">
													<span>Titulo del acabado (EN)</span>
													<Input
														values={values.titleEn}
														onChange={(ev) => {
															setFieldValue('titleEn',ev.target.value);
														}}  
														placeholder="Titulo de la etiqueta" />
												</div>
											</div>
											<div className="creation-tag-modal__container-button">
												<Button type="submit" primary>
													GUARDAR
												</Button>
											</div>
                    </Form>
										<Divider />
										<div>
											<Table>
												<Table.Header>
													<Table.Row>
														<Table.HeaderCell>Titulo</Table.HeaderCell>
														<Table.HeaderCell>Acciones</Table.HeaderCell>
													</Table.Row>
												</Table.Header>
												{
													list?.map(tag => (
														<Table.Body>
															<Table.Cell>{tag.titleEs}</Table.Cell>
															<Table.Cell>
																<Button onClick={() => {
																	deleteTermination(tag.idTerminations);
																	setOpen(false);
																}} color="red" className="button-modal-icon">
																	<Icon name="trash" color="white"/>
																</Button>
															</Table.Cell>
														</Table.Body>
													))
												}
											</Table>
										</div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    SALIR
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default CreationTerminationModal