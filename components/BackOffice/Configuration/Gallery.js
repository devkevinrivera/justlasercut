import React, { useState, useEffect } from 'react';
import axios from "axios";
const { v4: uuidv4 } = require('uuid');
import { Grid, Header, Button, Table, Modal, Divider, Form, Image, Icon, StepTitle } from 'semantic-ui-react';
import { BASE_URL } from '../../../constants/config';
import { useRouter } from 'next/dist/client/router';

const Gallery = () => {
    const router = useRouter();
    const { locale } = router;
    const [language, setLanguage] = useState(locale);
    const [update, setUpdate] = useState();
    const [galleryList, setGalleryList] = useState();

    useEffect(() => fetchGallery(), []);
    useEffect(() => fetchGallery(), [language]);
    useEffect(() => fetchGallery(), [update]);

    const fetchGallery = async () => {
        try {
            const fetchGalleryCall = await axios('/api/resources');
            const list = fetchGalleryCall.data.resources || [];
            setGalleryList(list.filter((item) => item.language === language));
        } catch (error) {
            console.error('No se puede obtener los datos del servidor')
        }
    };

    return (
        <Grid columns="16" className="service-box">
            <Grid.Row>
                <Grid.Column width={12} verticalAlign="middle">
                    <Header>CONFIGURACIÓN HOMEPAGE: GALERIA</Header>
                </Grid.Column>
                <Grid.Column width={4}>
                    <div className="languages">
                        <AddResource languageSelect={language} update={setUpdate} render={<Button primary content="+" />} />
                        <div onClick={() => setLanguage('es')} className={`languages__container ${language === 'es' && ('languages__active')}`}>
                            <Image src={`${BASE_URL}/flag_es.jpg`} alt="flag_spain" className="languages__flag" />
                        </div>
                        <Divider vertical />
                        <div onClick={() => setLanguage('en')} className={`languages__container ${language === 'en' && ('languages__active')}`}>
                            <Image src={`${BASE_URL}/flag_en.png`} alt="flag_english" className="languages__flag" />
                        </div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width="16">
                    <GalleryTable languageSelect={language} update={setUpdate} list={galleryList} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const AddResource = ({ update, render, languageSelect }) => {
    const [seo, setSeo] = useState();
    const [media, setMedia] = useState();
    const [href, setHref] = useState();
    const [open, setOpen] = useState();
    const [filename, setFilename] = useState();

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'small',
        trigger: render
    }

    const createResource = async () => {
        try {
            const id = uuidv4()
            const extension = filename.split('.').pop();
            const createCall = await axios.post('/api/resources', {
                title: seo,
                media: `${id}.${extension}`,
                link: href,
                language: languageSelect
            });
            if (media) {
                const data = new FormData();
                data.append('file', media);
                await axios.post('/api/multimedia', data, {
                    params: {
                        id: id
                    }
                });
            }
            setSeo();
            setMedia();
            setHref();
            update(Math.random());
            setOpen(false);
        } catch (error) {
            console.error('Error al crear recurso.');
        }
    };

    return (
        <Modal {...modalProps}>
            <Modal.Header>
                Añadir elemento a la galeria
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <input
                        value={seo}
                        onChange={ev => setSeo(ev.target.value)}
                        type="text"
                        placeholder="Introduzca informacion SEO" />
                    <input
                        value={href}
                        onChange={ev => setHref(ev.target.value)}
                        type="text"
                        placeholder="Introduzca vinculo de la imagen" />
                    <input
                        name="mediaManual"
                        onChange={ev => {
                            setFilename(ev.target.files[0].name)
                            setMedia(ev.target.files[0])
                        }
                        }
                        type="file"
                    />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    onClick={createResource}
                    primary
                    content="ACEPTAR"
                />
            </Modal.Actions>
        </Modal>
    )
}

const EditGalleryItem = ({ render, update, step }) => {
    const [open, setOpen] = useState();
    const [seo, setSeo] = useState(step.title);
    const [href, setHref] = useState(step.link);

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'small',
        trigger: render
    };

    const submitForm = async () => {
        try {
            const save = await axios.put('/api/resources', {
                title: seo,
                link: href
            }, {
                params: {
                    id: step.idResource
                }
            });
            setSeo('');
            setHref('');
            setOpen(false);
            update(Math.random());
        } catch (err) {
            console.error('Error al guardar comentario:', err);
        }
    };

    return (
        <Modal {...modalProps}>
            <Modal.Header>
                Editar elemento de la galeria
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <input
                        value={seo}
                        onChange={ev => setSeo(ev.target.value)}
                        type="text"
                        placeholder="Introduzca informacion SEO" />
                    <input
                        value={href}
                        onChange={ev => setHref(ev.target.value)}
                        type="text"
                        placeholder="Introduzca vinculo de la imagen" />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button primary content='ACEPTAR' onClick={() => { submitForm() }} />
            </Modal.Actions>
        </Modal>
    )
}

const GalleryTable = ({ list = [], update, languageSelect }) => {

    const deleteItemGallery = async (id) => {
        try {
            const res = await axios.delete('/api/resources', {
                params: {
                    id: id
                }
            });
            update(Math.random());
        } catch (error) {
            console.log('Error al borrar Opinion')
        }
    };

    return (
        <Table className="table-general">
            <Table.Header>
                <Table.HeaderCell>SEO</Table.HeaderCell>
                <Table.HeaderCell>ENLACE</Table.HeaderCell>
                <Table.HeaderCell>IMAGEN</Table.HeaderCell>
                <Table.HeaderCell>OPCIONES</Table.HeaderCell>
            </Table.Header>
            <Table.Body>
                {
                    list.filter(entry => entry.language === languageSelect).map((media, index) => {
                        const { title, link } = media;
                        return (
                            <Table.Row key={index}>
                                <Table.Cell>{title}</Table.Cell>
                                <Table.Cell>{link}</Table.Cell>
                                <Table.Cell>
                                    {media.media && (
                                        <Image src={`${BASE_URL}/${media.media}`} className="miniature-image" />
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Icon
                                        onClick={() => deleteItemGallery(media.idResource)}
                                        size="large"
                                        color="grey"
                                        className="custom-dropdown__icon"
                                        name='trash'
                                    />
                                    <EditGalleryItem
                                        step={media}
                                        render={<Icon size="large" color="grey" className="custom-dropdown__icon" name='pencil alternate' />}
                                        update={update}
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

export default Gallery;