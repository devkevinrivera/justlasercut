import React from 'react';
import { Container, Grid, Image } from 'semantic-ui-react';
import { BASE_URL } from '../../constants/config';
import parse from 'html-react-parser';

const Reviews = ({ list }) => {

    return (
        <Container fluid className="reviews">
            <Container>
                <Grid columns="16">
                    <Grid.Row className="reviews__list">
                        {
                            list?.map((review, keyItem) => (
                                <Review {...review} key={keyItem} />
                            ))
                        }
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
};


const Review = ({ autor, message, idAvatar }) => {
    return (
        <Grid.Column mobile="16" tablet="8" computer="5" className="review">
            <Grid columns="16">
                <Grid.Row>
                    <Grid.Column width="4" verticalAlign="middle">
                        <Image src={`/${idAvatar}`} />
                    </Grid.Column>
                    <Grid.Column width="12" verticalAlign="middle">
                        {parse(message.replace('<br />', ''))}
                        <p>{autor}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    )
}

export default Reviews;