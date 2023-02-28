import React, { useEffect, useState } from 'react';
import { Grid, Button, Image, Divider } from "semantic-ui-react";
import { deleteMaterial } from "../../../services/material";
import axios from "axios";

const CardMaterial = ({ material }) => {
    const { title, image, materialCategory, id } = material;
    const [categoryList, setCategoryList] = useState([]);
    const category = categoryList.find(category => category.id === materialCategory);

    useEffect(async () => {
        try {
            const { data: { steps } } = await axios(`/api/material-category`);
            setCategoryList(steps);
        } catch (err) {
            console.error(`Error al obtener lista de categorias: ${err}`)
        }
    }, []);

    return (
        <Grid columns="16" key={id} style={{ border: '1px solid gray', marginRight: '5px' }}>
            <Grid.Row>
                <Grid.Column width="16" style={{ display: 'flex', justifyContent: 'flex-end' }} >
                    <Button size="mini" color='red' onClick={async () => {
                        const res = await deleteMaterial(id);
                    }}>Eliminar</Button>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ padding: '0px' }}>
                <Grid.Column width="16">
                    <Image style={{ height: '7rem', width: '100%' }} bordered src={`/${image}`} />
                </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row style={{ padding: '0px' }}>
                <Grid.Column width="16" >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p><b>{title?.es}</b></p>
                        <span>{category?.category?.name?.es}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p>precio</p>
                        <p>Stock</p>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default CardMaterial;