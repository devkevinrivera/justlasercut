import React, { useState } from 'react';
import { Container, Grid, Header, Button, Form, Input, Message } from "semantic-ui-react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
const { v4: uuidv4 } = require('uuid');
import parse from 'html-react-parser';

const languages = {
    en: require('../locale/en/commons.json'),
    es: require('../locale/es/commons.json'),
}

const Contacto = () => {
    return (
        <Container style={{ minHeight: '75vh', paddingTop: '75px' }}>
            <Grid columns="16">
                <Grid.Row>
                    <Grid.Column computer="8" tablet="8" mobile="16">
                        <InfoContact />
                    </Grid.Column>
                    <Grid.Column computer="8" tablet="8" mobile="16">
                        <ContactForm />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
};

const ContactForm = () => {
    const { register, handleSubmit, watch, reset, formState = { errors } } = useForm();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [multimedia, setMultimedia] = useState('');
    const [filename, setFilename] = useState();

    const onSubmit = data => {
        const sendMessage = async () => {
            try {
                setLoading(true);
                const id = uuidv4();
                const extension = filename?.split('.').pop();
                const response = await axios.post(`/api/contact`, {
                    ...data,
                    filename: filename ? `${id}.${extension}` : '',
                    id: id
                });
                console.log(`multimedia ${multimedia}`)
                if (multimedia) {
                    const media = new FormData();
                    media.append('file', multimedia);
                    await axios.post(`/api/multimedia`, media, {
                        params: {
                            id: id
                        }
                    })
                }
                reset();
                setLoading(false);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } catch (err) {
                setError(true);
                console.log(`${err}`)
                setTimeout(() => {
                    setError(false);
                }, 5000);
            }
        };
        sendMessage();
    }

    return (
        <Grid columns="16">
            <Grid.Row className="contact-form__form">
                <Grid.Column largeScreen="12" tablet="14" mobile="16">
                    {success && (
                        <Message
                            success
                            header='Tu mensaje se ha enviado correctamente'
                            content='Nos pondremos en contacto contigo para responder tus dudas'
                        />
                    )}
                    {error && (
                        <Message
                            error
                            header='¡Algo a salido mal!'
                            content='Intentalo mas tarde o escribenos a info@archicercle.com'
                        />
                    )}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Field>
                            <input type="email" required placeholder="Correo Electronico" {...register("email")} />
                        </Form.Field>
                        <Form.Field>
                            <input type="number" min="0" placeholder="Número de referencia" {...register("numberRef")} />
                        </Form.Field>
                        <Form.Field>
                            <input required type="text" placeholder="Asunto" {...register("subject")} />
                        </Form.Field>
                        <Form.Field>
                            <textarea required rows="5" placeholder="Mensaje" {...register("message")} />
                        </Form.Field>
                        <Form.Field>
                            <input onChange={(ev) => {
                                setFilename(ev.target.files[0].name);
                                setMultimedia(ev.target.files[0]);
                            }} type="file" name="mediaManual" />
                        </Form.Field>
                        <Button loading={loading} className="button-main" loading={loading} type="submit" content='ENVIAR' primary />
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
};

const InfoContact = () => {
    const router = useRouter();
    const { locale } = router;
    const t = languages[locale];

    return (
        <>
            <Header>
                {parse(t.cuentanostuidea)}
            </Header>
            <p>
                {parse(t.contactomensaje)}
            </p>
            <p>
                {parse(t.tienesdudas)}
                {parse(t.email)}
            </p><br />
            <p>
                {parse(t.ganasdehablar)}
                {t.number}
                {parse(t.horario)}
            </p>
        </>
    )
}
export default Contacto;