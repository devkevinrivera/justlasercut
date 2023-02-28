import React, { useState, useEffect } from 'react';
import { Grid, Header, Divider, Icon, Image, Modal, Button, Form, Table } from 'semantic-ui-react';
import axios from "axios";
import { useRouter } from "next/router";
const { v4: uuidv4 } = require('uuid');
import { CKEditor } from 'ckeditor4-react';
import parse from 'html-react-parser';

const FeedBack = () => {
    const router = useRouter();
    const { locale } = router;
    const [language, setLanguage] = useState(locale);
    const [reviews, setReviews] = useState([]);
    const [update, setUpdate] = useState();

    useEffect(() => fetchFeedBack(), []);
    useEffect(() => fetchFeedBack(), [update, language]);

    const fetchFeedBack = async () => {
        try {
            const fetchFeed = await axios('/api/reviews');
            setReviews(fetchFeed.data.list.filter((item) => item.language === language));
        } catch (error) {
            console.error('No se puede obtener los datos del servidor')
        }
    };


    return (
        <Grid columns={16} className="service-box">
            <Grid.Row>
                <Grid.Column width={12} verticalAlign="middle">
                    <Header as="h3">CONFIGURACIÓN HOMEPAGE: COMENTARIOS</Header>
                </Grid.Column>
                <Grid.Column width={4} className="box-language">
                    <AddFeedBack action={setUpdate} language={language} render={<Button primary content="+" />} />
                    <div className="languages">
                        <div onClick={() => setLanguage('es')} className={`languages__container ${language === 'es' && ('languages__active')}`}>
                            <Image src={`/flag_es.jpg`} alt="flag_spain" className="languages__flag" />
                        </div>
                        <Divider vertical />
                        <div onClick={() => setLanguage('en')} className={`languages__container ${language === 'en' && ('languages__active')}`}>
                            <Image src={`/flag_en.png`} alt="flag_english" className="languages__flag" />
                        </div>
                    </div>

                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width="16">
                    <TableFeedBack action={setUpdate} list={reviews} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const TableFeedBack = ({ list = [], action }) => {

    const executeTask = () => {
        action(Math.random());
    };

    const deleteReview = async (id) => {
        try {
            const res = await axios.delete('/api/reviews', {
                params: {
                    id: id
                }
            });
            action(Math.random())
        } catch (error) {
            console.log('Error al borrar Opinion')
        }
    };

    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>AUTOR</Table.HeaderCell>
                    <Table.HeaderCell>MENSAJE</Table.HeaderCell>
                    <Table.HeaderCell>AVATAR</Table.HeaderCell>
                    <Table.HeaderCell>OPCIONES</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {
                    list.map((review, index) => {
                        const { autor, message, idAvatar } = review;
                        return (
                            <Table.Row key={index} className="table-general">
                                <Table.Cell>{autor}</Table.Cell>
                                <Table.Cell>{parse(message)}</Table.Cell>
                                <Table.Cell>
                                    {idAvatar && (
                                        <Image src={`/${idAvatar}`} className="miniature-image" />
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Icon
                                        onClick={() => deleteReview(review.id)}
                                        size="large"
                                        color="grey"
                                        className="custom-dropdown__icon"
                                        name='trash'
                                    />
                                    <EditFeedBack
                                        action={executeTask}
                                        render={<Icon size="large" color="grey" className="custom-dropdown__icon" name='pencil alternate' />}
                                        review={review}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>
    )
}

const AddFeedBack = ({ render, action, language }) => {
    const [open, setOpen] = useState();
    const [autor, setAutor] = useState('');
    const [avatar, setAvatar] = useState();
    const [nameFile, setNameFile] = useState();
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        setAutor('');
        setMessage('');
        setAvatar();
    }, [open])

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'small',
        trigger: render
    };

    const submitForm = async () => {
        const extension = nameFile?.split('.').pop();
        try {
            const idTransaction = uuidv4();
            const save = await axios.post('/api/reviews', {
                autor: autor,
                idAvatar: `${idTransaction}.${extension}`,
                id: idTransaction,
                message: message,
                language: language
            });
            if (avatar) {
                const data = new FormData();
                data.append('file', avatar);
                const uploadMedia = await axios.post(`/api/multimedia`, data, {
                    params: {
                        id: idTransaction,
                    }
                });
            };
            action(Math.random())
            setAutor('');
            setMessage('');
            setAvatar();
            setOpen(false);
        } catch (err) {
            console.error('Error al guardar comentario:', err);
        }
    };

    return (
        <Modal {...modalProps} className="feedback-modal">
            <Modal.Header>
                Añadir nuevo comentario
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <input
                        value={autor}
                        onChange={ev => { setAutor(ev.target.value) }}
                        placeholder="Nombre del autor"
                        className="feedback-modal__name"
                    />
                    <CKEditor
                        data={message}
                        onChange={evt => setMessage(evt.editor.getData())}
                    />
                    <input
                        type="file"
                        name="mediaManual"
                        onChange={ev => {
                            setNameFile(ev.target.files[0].name)
                            setAvatar(ev.target.files[0])
                        }}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={submitForm} primary content="GUARDAR" />
            </Modal.Actions>
        </Modal>
    )
}


const EditFeedBack = ({ render, review, action }) => {
    const [open, setOpen] = useState();
    const [autor, setAutor] = useState('');
    const [avatar, setAvatar] = useState();
    const [message, setMessage] = useState('');

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'small',
        trigger: render
    };

    useEffect(() => {
        if (review) {
            setAutor(review.autor);
            setMessage(review.message);
        }
    }, [open])

    const submitForm = async () => {
        try {
            const save = await axios.put('/api/reviews', {
                autor: autor,
                message: message
            }, {
                params: {
                    id: review.id
                }
            });
            action();
            setAutor('');
            setMessage('');
            setAvatar();
            setOpen(false);
        } catch (err) {
            console.error('Error al guardar comentario:', err);
        }
    };

    return (
        <Modal {...modalProps} className="feedback-modal">
            <Modal.Header>
                Editar comentario
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <input
                        value={autor}
                        onChange={ev => setAutor(ev.target.value)}
                        placeholder="Nombre del autor"
                        className="feedback-modal__name"
                    />
                    <CKEditor
                        initData={review.message}
                        data={message}
                        onChange={evt => setMessage(evt.editor.getData())}
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={submitForm} primary content="GUARDAR" />
            </Modal.Actions>
        </Modal>
    )
}



export default FeedBack;