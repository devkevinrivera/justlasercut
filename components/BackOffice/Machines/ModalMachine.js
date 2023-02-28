import React , { useState } from 'react';
import { Modal, Header, Button, Icon, Form } from "semantic-ui-react";
import { useFormik } from 'formik';
import { useMachine } from "../../../hooks/useMachine";

const ModalMachine = ({ edit = false , objectEdit }) => {
	const [open, setOpen] = useState(false)
	const { createMachine, getAllMachines, editMachine } = useMachine();

	const { values , handleSubmit, setFieldValue } = useFormik({
		initialValues: {
			name: objectEdit?.name ||  '',
			maxWidth: objectEdit?.maxWidth,
			maxHeight:  objectEdit?.maxHeight,
			description:  objectEdit?.description,
			maxWeight:  objectEdit?.maxWeight,
			minutePrice:  objectEdit?.minutePrice,
		},
		enableReinitialize: true,
		onSubmit: values => {
			if (!edit) {
				createMachine(values);
			} else {
				editMachine({
					...values,
					_id: objectEdit._id
				});
			}
			setOpen(false);
		},
	});

  return (
    <Modal
      closeIcon
      open={open}
      trigger={edit ? (
				<Button color="green" className="button-modal-icon">
					<Icon name="pencil alternate" />
				</Button>
			) : (
				<Button primary>Registrar maquina</Button>
			)}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
			className="modal-machine"
    >
      <Header 
				icon='plus' 
				content={
					edit ? 'Editar maquina' : 'Registrar maquina' 
				} 
			/>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
					<label htmlFor="firstName">Nombre</label>
					<input
						type="text"
						value={values.name}
						onChange={ev => setFieldValue('name',ev.target.value)}
					/>
						<div className="modal-machine__sizes">
							<div className="field">
								<label htmlFor="firstName">Ancho maximo</label>
								<input
									type="number"
									value={values.maxWidth}
									onChange={ev => setFieldValue('maxWidth',ev.target.value)}
								/>
							</div>
							<div className="field">
								<label htmlFor="firstName">Alto maximo</label>
								<input
									type="number"
									value={values.maxHeight}
									onChange={ev => setFieldValue('maxHeight',ev.target.value)}
								/>
							</div>
							<div className="field">
								<label htmlFor="maxWeight">Grosor maximo</label>
								<input
									type="number"
									value={values.maxWeight}
									onChange={ev => setFieldValue('maxWeight',ev.target.value)}
								/>
							</div>
							
							<div className="field">
								<label htmlFor="minutePrice">Precio por minuto</label>
								<input
									type="number"
									value={values.minutePrice}
									onChange={ev => setFieldValue('minutePrice',ev.target.value)}
								/>
							</div>
						</div>
						<label htmlFor="firstName">Descripción</label>
						<input
							type="text"
							value={values.description}
							onChange={ev => setFieldValue('description',ev.target.value)}
						/>
					<div className="modal-machine__actions">
						<Button type="submit" primary>Añadir</Button>
					</div>			
				</Form>
      </Modal.Content>
      
    </Modal>
  )
};

export default ModalMachine;