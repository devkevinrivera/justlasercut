import React from 'react';
import { Container , Grid, Header, Divider, Image } from 'semantic-ui-react';

const Advantages = ({ advantages, t }) => {
    console.log(advantages)
    return (
        <Container className='advantages'>
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column width="16" className="service__title">
                        <Header as="h2">Ventajas del corte laser</Header>
                        <Divider />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={16}>
                        <Grid>
                            {
                                advantages.map(advantage => (
                                    <AdvantageItem item={advantage} key={Math.random()} />
                                ))
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

const AdvantageItem = ({ item }) => {

    return (
        <Grid.Column computer={8} className="advantages__item">
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column computer={2} verticalAlign="middle">
                        <Image src={item.source} />
                    </Grid.Column>
                    <Grid.Column computer={14} verticalAlign="middle">
                        <Header as={'h4'}>{item.title}</Header>
                        <p>{item.description}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    )
}

export default Advantages;