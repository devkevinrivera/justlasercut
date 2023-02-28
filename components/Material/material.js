import React from 'react';
import { Grid, Image } from "semantic-ui-react"
import ModalMaterial from '../ModalMaterial';

const Material = (props) => {
    const { title, image, id } = props.material
    return (
        <Grid.Column computer={3} tablet={5} mobile={16} className="material">
            <Grid columns="16">
                <Grid.Row className="material__title">
                    <Grid.Column width="16" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <p>
                                <b>{title?.es}</b>
                            </p>
                        </div>
                        <ModalMaterial material={props.material} />
                    </Grid.Column>
                    <Grid.Column width="14">

                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="material__image">
                    <Grid.Column width="16" style={{ height: '15rem', }}>
                        <Image src={image} alt={title?.es} style={{ width: '100%' }} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    );
};

export default Material;