import React from 'react';
import { Container , Grid, Header, Divider, Image } from 'semantic-ui-react';

const Technologies = ({ t, list}) => {
    return (
        <Container className='advantages'>
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column width="16" className="service__title">
                        <Header as="h2">¿Qué tecnología usamos?</Header>
                        <Divider />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={16}>
                        <Grid>
                            {
                                list.map((entry) => (
                                    <TechItem item={entry} key={Math.random()}/>
                                ))
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

const TechItem = ({ item }) => {

    return (
        <Grid.Column computer={4} className="advantages__item">
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column computer={16} verticalAlign="middle">
                        <Image src="circlebox.png" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    )
}

export default Technologies;