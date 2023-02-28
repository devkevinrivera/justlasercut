import React from 'react';
import { Container , Grid, Header, Divider, Image } from 'semantic-ui-react';

const Aplications = ({ list }) => {
    console.log(list)
    return (
        <Container className='aplications'>
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column width="16" className="aplications__title">
                        <Header as="h2">Sectores de aplicación</Header>
                        <Divider />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={16}>
                        <Grid  className="aplications__rows">
                            {
                                list.map((entry) => (
                                    <TechGalleryItem item={entry} key={Math.random()}/>
                                ))
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

const TechGalleryItem = ({ item }) => {
    console.log(item.source)
    return (
        <Grid.Column computer={5} className="aplications__item">
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column computer={3} verticalAlign="middle">
                        <Image src={item.source} size="large" />
                    </Grid.Column>
                    <Grid.Column computer={13} verticalAlign="middle">
                        <p>Joyeria</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    )
}
export default Aplications;