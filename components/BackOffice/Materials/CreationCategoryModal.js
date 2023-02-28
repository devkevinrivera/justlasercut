import React, { useEffect, useState } from 'react'
import { Button, Form, Header, Image, Modal, Divider } from 'semantic-ui-react'
import { createCategoryMaterial, getCategoryMaterials, deleteCategoryMaterials } from "../../../services/material";
import { useForm } from "react-hook-form";

function CreationCategoryModal() {
    const [open, setOpen] = React.useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const { register, reset, handleSubmit, watch, formState: { errors } } = useForm();

    const handlerDeleteCategory = async (id) => {
        try {
            await deleteCategoryMaterials(id);
            reset();
        } catch (e) {
            console.error(`No se puede eliminar la categoria`)
        }
        setOpen(false);
    }

    useEffect(async () => {
        try {
            const info = await getCategoryMaterials();
            const { data: { steps } } = info;
            setCategoryList(steps);
            reset();
        } catch (err) {
            console.error(`Error al obtener categorias:`, err);
        }
    }, [open]);

    const onSubmitData = async (data) => {
        try {
            const post = await createCategoryMaterial(data);
            setOpen(false);
            reset();
        } catch (err) {
            console.log('Error al crear categoria del material')
        }
    };

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button primary>+ Añadir Categoria</Button>}
        >
            <Modal.Header>Formulario de creación de categorias</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form onSubmit={handleSubmit(onSubmitData)}>
                        <div>
                            <div>
                                <input {...register('category.name.es')} style={{ marginBottom: '10px' }} placeholder="Nombre de categoria en Español" />
                                <input {...register('category.name.en')} style={{ marginBottom: '10px' }} placeholder="Nombre de categoria en Ingles" />
                            </div>
                            <input type="submit" />
                        </div>
                    </Form>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        {
                            categoryList.map(category => (
                                <div style={{ border: '1px solid gray', padding: '10px' }}>
                                    <p>{category?.category?.name?.es}</p>
                                    <Button content='Elimiar' color='red' onClick={() => handlerDeleteCategory(category.id)} />
                                </div>
                            ))
                        }
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

export default CreationCategoryModal