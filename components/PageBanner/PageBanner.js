import React from 'react';
import { Container, Grid , Header } from 'semantic-ui-react';

const PageBanner = ({title}) => {
    return (
        <>
             <Container fluid  className="pagebanner">
                <Container>
                        <Grid columns="16">
                        <Grid.Row>
                            <Grid.Column width="16" className="pagebanner__title">
                                <Header  className="pagebanner__titlepage">{title}</Header>
                            </Grid.Column>
                        </Grid.Row>
                        </Grid>
                    </Container>
            </Container>
        </>
    );
};

export default PageBanner;