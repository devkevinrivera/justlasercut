import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Container, Grid, Header, Image, Divider } from "semantic-ui-react";
import parse from 'html-react-parser';
import { Dimmer, Loader, Segment } from 'semantic-ui-react'
import HtmlParser from 'react-html-parser';

const articulo = ({ blog }) => {
    const [article, setArticle] = useState();

    useEffect(() => {
        const article = JSON.parse(localStorage.getItem('article'))
        const handler = async () => {
            try {
                const { data } = await axios(`/api/blog`);
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
                                    {
                                        article.gallery?.map((media) => <Image src={`/${media}`} className='article__image' />)
                                    }
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
                {
                    article.blocks.map(section => (<BlockArticleContainer data={section} />))
                }
                <Container className='redes-block'>
                    <Grid columns={16}>
                        <Grid.Row>
                            <Grid.Column className='redes-block__container' computer={16} >
                                <p>¿Te ha gustado? Compártelo :)</p>
                                <div style={{ display: 'flex' }}>
                                    <Image src="/button_facebook.png" />
                                    <Image src="/button_instagram.png" />
                                    <Image src="/button_ilinkedin.png" />
                                    <Image src="/button_pinterest.png" />
                                    <Image src="/button_twiter.png" />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
                </>
            )
        }
        </>
        
    );
};

const BlockArticleContainer = ({ data }) => {

    return (
        <Container className='block-article'>
            <Grid columns={16}>
                <Grid.Row>
                    <Grid.Column computer={10}>
                        <Header as='h3'>{data.titular}</Header>
                        <p className='block-article__parrafo'>
                           {HtmlParser(data?.content)}
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
                        {
                            data.gallery.map(image => <Image className='block-article__media' src={`/${image}`} fluid/>)
                        }
                        
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
}
export default articulo;