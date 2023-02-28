import React, { useEffect, useState } from 'react';
import { Container, Grid, Icon, Image, Button } from 'semantic-ui-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { BASE_URL } from "../../constants/config";

const languages = {
    en: require('../../locale/en/commons.json'),
    es: require('../../locale/es/commons.json')
};

const FooterJust = () => {
    const [site, setSite] = useState();
    const { locale } = useRouter();
    const router = useRouter();
    const t = languages[locale];

    useEffect(() => {
        const getSiteInfo = async () => {
            try {
                const request = await axios('/api/site');
                setSite(request.data.configurationSite[0]);
            } catch (err) {
                console.error(err)
            }
        };
        getSiteInfo();
    }, []);

    return (
        <Container fluid className="footer-just" id="footer-just">
            <Container>
                <Grid columns="16">
                    <Grid.Row>
                        <Grid.Column computer="4" tablet={8} mobile={16} className="footer-business">
                            <Image src={`/JustLaserLogoSummerWhite.png`} alt="flag_spain" />
                            <Image src={`https://cosastudio.com/wp-content/uploads/2018/05/firma-archi.png.webp`} alt="flag_spain" />
                            <Image src={`/cosas-estudio.svg`} alt="flag_spain" />
                        </Grid.Column>
                        <Grid.Column computer="4" tablet={8} mobile={16} className="footer-legal">
                            <p>C/Utiel 6, Bajo Valencia 46020</p>
                            <p className="name-mini">hola@cosastudio.com</p>
                            <p>+34 649 99 98 53</p>
                            <p>960 15 20 34</p>
                            <p><b>Datos fiscales</b></p>
                            <p >Pablo Pastor Ripoll</p>
                            <p >C/Utiel 6, Bajo Valencia 46020</p>
                            <p >España</p>
                            <p>NIF 48601886B</p>
                            <p>649999853</p>
                            <p>hola@cosastudio.com</p>
                            <div style={{ marginTop: '30px'}}>
                                <Icon name="instagram" size="big" />
                                <Icon name="facebook" size="big" />
                                <Icon name="twitter" size="big" />
                            </div>
                        </Grid.Column>
                        <Grid.Column computer={4} mobile={16} tablet={16} className="footer-legal-doc">
                            <p>C/Utiel 6, Bajo Valencia 46020</p>
                            <p onClick={() => router.push('/contacto')}>· Contacta con nosotros</p>
                            <p onClick={() => router.push('/terminos-condiciones#condiciones')}>· Términos y condiciones</p>
                            <p onClick={() => router.push('/terminos-condiciones#envios')}>· Política de envío</p>
                            <p onClick={() => router.push('/terminos-condiciones#devolucion')}>. Política de devolución</p>
                            <p onClick={() => router.push('/terminos-condiciones#privacidad')}>· Política de privacidad</p>
                        </Grid.Column>
                        <Grid.Column computer={4} mobile={16} tablet={16} className="footer-legal-doc">
                            <h4>¿No encuentras lo que buscas? ¿Quieres hacer realidad un producto diferente?</h4>
                            <p>En la tienda de Justlasercut hemos intentado estandarizar todos nuestros diseños con la posibilidad de personalizarlos. Pero, también puedes utilizar nuestro catálogo como inspiración 
                                para diseñar cualquier producto a medida a través de nuestro estudio Archicercle.</p>
                            <p style={{
                                marginBottom: '3rem !important'
                            }}>¡Ponte en contacto con nosotros y cuéntanos tu idea!</p>
                            <Button>Contactar</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="derechos-archicercle">
                        <Grid.Column computer={16} mobile={16} tablet={16} textAlign="center" verticalAlign='middle'>
                            <p>© Copyright 2008 - 2022   |  Todos los derechos reservados |  Creado y diseñado por © Justlasercut</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className="derechos-archicercle">
                        <Grid.Column computer={16} mobile={16} tablet={16} textAlign="center" verticalAlign='middle'>
                            <Image src={`https://cosastudio.com/wp-content/uploads/2019/01/METODOS-DE-PAGO.png.webp`} alt="flag_spain" />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
};

export default FooterJust;