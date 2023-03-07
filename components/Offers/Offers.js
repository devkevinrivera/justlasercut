import React from 'react';
import { Container, Divider, Grid, Header, Image } from 'semantic-ui-react';
import { BASE_URL } from '../../constants/config';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Offers = ({ list }) => {
    return (
        <Container fluid className="offers">
            <Container >
                <Grid columns="16">
                    <Grid.Row className="offers__container-items">
                        <Grid.Column computer={16} style={{padding: '0px'}}>
                            <Carousel showThumbs={false} showIndicators={false} showStatus={false}>
                                {
                                    list.map((entry) => (
                                        <div>
                                            <img src={entry.media} />
                                        </div>
                                    ))
                                }
                            </Carousel>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
};

export default Offers;