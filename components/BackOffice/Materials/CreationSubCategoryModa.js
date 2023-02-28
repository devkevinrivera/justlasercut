import React, { useEffect, useState } from 'react'
import { Button, Form, Header, Image, Modal, Divider } from 'semantic-ui-react'
import { createSubCategoryMaterial, getSubCategoryMaterials, deleteSubCategoryMaterials, getCategoryMaterials } from "../../../services/material";
import { useForm } from "react-hook-form";

function CreationSubcategoryCategoryModal() {
    const [open, setOpen] = React.useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [mainCategoryList, setMainCategoryList] = useState([]);

    const { register, reset, handleSubmit, watch, formState: { errors } } = useForm();

    const handlerDeleteCategory = async (id) => {
        try {
            await deleteSubCategoryMaterials(id);
            reset();
        } catch (e) {
            console.error(`No se puede eliminar la categoria`)
        }
        setOpen(false);
    }

    useEffect(async () => {
        try {
            const info = await getSubCategoryMaterials();
            const categoryListFetch = await getCategoryMaterials();

            const { data: { steps } } = info;
            setCategoryList(steps);
            setMainCategoryList(categoryListFetch.data.steps);
            reset();
        } catch (err) {
            console.error(`Error al obtener categorias:`, err);
        }
    }, [open]);

    const onSubmitData = async (data) => {
        try {
            const post = await createSubCategoryMaterial(data);
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
            trigger={<Button primary>+ Añadir SubCategoria</Button>}
        >
            <Modal.Header>Formulario de creación de subcategorias</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Form onSubmit={handleSubmit(onSubmitData)}>
                        <div>
                            <div>
                                <input {...register('subcategory.name.es')} style={{ marginBottom: '10px' }} placeholder="Nombre de subcategoria en Español" />
                                <input {...register('subcategory.name.en')} style={{ marginBottom: '10px' }} placeholder="Nombre de subcategoria en Ingles" />
                            </div>
                            <select style={{ marginBottom: '1rem' }} {...register("subcategory.categoryId")}>
                                {
                                    mainCategoryList.map(({ category, id }) => (
                                        <option value={id}>{category?.name?.es}</option>
                                    ))
                                }
                            </select>
                            <input type="submit" />
                        </div>
                    </Form>
                    <Divider />
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                        {
                            categoryList.map(category => (
                                <div style={{ border: '1px solid gray', padding: '10px' }}>
                                    <p>{category?.subcategory?.name?.es}</p>
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

export default CreationSubcategoryCategoryModal