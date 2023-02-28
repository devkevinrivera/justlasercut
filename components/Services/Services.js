import React from 'react';
import { Container, Grid, Header, Image, Button, Divider, Icon } from 'semantic-ui-react';
import { BASE_URL } from "../../constants/config";

const Services = ({ list, t }) => {

    return (
        <Container fluid className="service">
            <Container>
                <Grid columns="16">
                    <Grid.Row>
                        <Grid.Column width="16" className="service__title">
                            <Header as="h2">{t.inspiracionesrecursos}</Header>
                            <Divider />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {
                            list.map((service, key) => (
                                <Grid.Column key={key} computer={4} mobile={8} tablet={4} className="service__item">
                                    <Image
                                        alt={service.title}
                                        href={service.link}
                                        src={`${BASE_URL}/${service.media}`} />
                                </Grid.Column>
                            ))
                        }
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={16} textAlign="center">
                            
                            <Button primary className="button-main" color="red" primary>
                                <Icon size="large" name="instagram" />
                                INSTAGRAM
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
};

export default Services;