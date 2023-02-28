import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import './ExampleComponent.module.scss';

const ExampleComponent = ({ title }) => {
    return (
        <Container>
            <Grid columns="16">
                <Grid.Row>
                    <Grid.Column width="16">
                        {title}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

export default ExampleComponent;