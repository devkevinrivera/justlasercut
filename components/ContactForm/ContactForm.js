import React, { useState } from 'react';
import { Container, Grid, Form, Input, Button, Header, Divider, Message, Image } from 'semantic-ui-react';
import { useForm } from "react-hook-form";
import { BASE_URL } from '../../constants/config';
import axios from "axios";
const { v4: uuidv4 } = require('uuid');

const ContactForm = ({ t }) => {
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
                const extension = filename.split('.').pop();
                const response = await axios.post(`/api/contact`, {
                    ...data,
                    filename: `${id}.${extension}`,
                    id: id
                });
                if (multimedia) {
                    const media = new FormData();
                    media.append('file', multimedia);
                    await axios.post(`${BASE_URL}/api/multimedia`, media, {
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
                console.log(err)
                setError(true);
                setTimeout(() => {
                    setError(false);
                }, 5000);
            }
        };
        sendMessage();
    }

    return (
        <Container fluid className="contact-form">
            <Container>
                <Grid columns="16">
                    <Grid.Row className="contact-form__form">
                        <Grid.Column computer={8}>
                            <Header as="h2">¿Alguna duda?</Header>
                            <p>Rellena el formulario y envíanos tu consulta</p>
                            <Image src="/contacto.svg" className='icon-contacto'/>
                        </Grid.Column>
                        <Grid.Column computer={8} tablet="14" mobile="16">
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
                                    <Input onChange={(ev) => {
                                        setFilename(ev.target.files[0].name);
                                        setMultimedia(ev.target.files[0]);
                                    }} type="file" name="mediaManual" />
                                </Form.Field>
                                <Button fluid loading={loading} className="button-send" type="submit" content='ENVIAR' primary />
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
};

export default ContactForm;