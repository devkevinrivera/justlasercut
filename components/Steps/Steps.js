import React from 'react';
import { Container, Divider, Grid, Header, Image } from 'semantic-ui-react';
import { BASE_URL } from '../../constants/config';
const Steps = ({ steps = [], t }) => {

    return (
        <Container fluid className="steps-just">
            <Container>
                <Grid columns="16">
                    <Grid.Row className="steps-just__header">
                        <Header as="h2">{t.comofunciona}</Header>
                        <Divider />
                    </Grid.Row>
                    <Grid.Row className="step-just__container-items">
                        {steps.map((step, key) => <Step key={key} step={step} />)}
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
};


const Step = (step) => {
    const { description, title, source } = step.step;
    return (
        <Grid.Column computer={3} tablet={5} mobile={8} className="step-just">
            <Image src={`${BASE_URL}/${source}`} />
            <Header as="h4">{title}</Header>
            {description && (<p>{description}</p>)}
        </Grid.Column>
    )
}
export default Steps;