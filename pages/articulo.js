import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Container, Grid, Header, Image, Divider } from "semantic-ui-react";
import parse from 'html-react-parser';
import { Dimmer, Loader, Segment } from 'semantic-ui-react'

const articulo = ({ blog }) => {
    const [article, setArticle] = useState();

    useEffect(() => {
        const article = JSON.parse(localStorage.getItem('article'))
        const handler = async () => {
            try {
                const { data } = await axios(`/api/blog`);
                console.log(data)
                data?.blog?.map(entry => {
                    if (entry.id === article.id) {
                        setArticle(entry)
                    }
                })
            } catch (err) {
                console.error(err)
            }
        };
        handler();
    }, [])

    /*
        CABECERA
        FECHA
        ETIQUETAS: []
        PARRAFO
        GALERIA
    */
    return (
        <>
        {
            !article ? (
                <Segment className='loading-blog'>
                    <Dimmer active>
                        <Loader size='big'>CARGANDO...</Loader>
                    </Dimmer>
                </Segment>
            ) :
            (
                <>
                <Container style={{ paddingTop: '40px', paddingBottom: '70px' }} className="article">
                    <Grid columns={16}>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Header as='h1' className='article__title'>{article?.title}</Header>
                                <span className='article__date'>13 Octubre 2022</span>
                            </Grid.Column>
                            <Grid.Column computer={16} className="article__container-tags">
                                <div className='article__tag'>
                                    <span>Decoración</span>
                                </div>
                                <div className='article__tag'>
                                    <span>Madera</span>
                                </div>
                                <div className='article__tag'>
                                    <span>Decoración</span>
                                </div>
                            </Grid.Column>
                            <Grid.Column computer={10} tablet={16}>
                                <p className='article__introduction'>
                                    <p>{parse(`${article?.content}`)}</p>
                                </p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
                <Container fluid className='gallery-box'>
                    <Grid columns={16}>
                        <Grid.Row>
                            <Grid.Column computer={16}>
                                <div className='article__container'>
                                    <Image src="/background.png" className='article__image' />
                                    <Image src="/background.png" className='article__image' />
                                    <Image src="/background.png" className='article__image' />
                                    <Image src="/background.png" className='article__image' />
                                    <Image src="/background.png" className='article__image' />
                                    <Image src="/background.png" className='article__image' />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
                <BlockArticleContainer />
                <BlockArticleContainer />
                <BlockArticleContainer />∫
                </>
            )
        }
        </>
        
    );
};

const BlockArticleContainer = () => {

    return (
        <Container className='block-article'>
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column computer={10}>
                        <Header as='h3'>La UE sospecha que Rusia está detrás de </Header>
                        <p className='block-article__parrafo'>
                            La UE sospecha que Rusia está detrás de las     cuatro fugas detectadas esta semana en los gasoductos del Nord Stream I y Nord Stream II. Algo que será difícil de demostrar y que tanto en la UE como en la OTAN consideran un acto de "sabotaje". De demostrarse, significaría el primer ataque directo de Rusia a infraestructuras europeas en medio de la guerra energética que libran en paralelo Bruselas y Moscú. "Rusia está poniendo la seguridad global en riesgo", advierte el bloque comunitario.
                        </p>
                    </Grid.Column>
                    <Grid.Column computer={6} verticalAlign="middle">
                        <div className='block-article__tip'>
                            <h5>Justtip</h5>
                            <p>“Mide dos veces, corta una”</p>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column computer={16}>
                        <Image className='block-article__media' src="/background.png" fluid/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}
export default articulo;