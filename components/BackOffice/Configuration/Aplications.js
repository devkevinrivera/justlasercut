import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Modal, Divider, Form, Image, Icon, StepTitle } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
const { v4: uuidv4 } = require('uuid');
import axios from "axios";
import { BASE_URL } from '../../../constants/config';
import { description } from 'platform';
import { useRouter } from 'next/router';

const Aplications = () => {
    const router = useRouter();
    const { locale } = router;
    const [language, setLanguage] = useState(locale);
    const [update, setUpdate] = useState();
    const [steps, setSteps] = useState();

    useEffect(() => fetchAplications(), [language]);
    useEffect(() => fetchAplications(), [update]);
    useEffect(() => fetchAplications(), []);

    const fetchAplications = async () => {

        try {
            const fetchSteps = await axios('/api/aplications');
            setSteps(fetchSteps.data.steps);
        } catch (error) {
            console.error('No se puede obtener los datos del servidor')
        }
    };

    return (
        <Grid columns={16}>
            <Grid.Row>
                <Grid.Column width="12" verticalAlign="middle">
                    <Header>CONFIGURACIÓN VENTAJAS</Header>
                </Grid.Column>
                <Grid.Column width="4">
                    <div className="languages">
                        <AddAplicationItem language={language} update={setUpdate} render={<Button primary content="+" />} />
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
                    <AplicationsTable update={setUpdate} advantages={steps} languages={language} />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};


const AddAplicationItem = ({ render, update, language }) => {
    const [open, setOpen] = useState();
    const [source, setSource] = useState();
    const [title, setTitle] = useState();
    const [meta,setMeta] = useState();
    const [description, setDescription] = useState();
    const [filename, setFilename] = useState();
    
    const createAdvantage = async () => {
        try {
            const idTransaction = uuidv4();
            const extension = filename.split('.').pop();
            const save = await axios.post('/api/aplications', {
                idStep: idTransaction,
                title: title,
                source: `${idTransaction}.${extension}`,
                language: language
            });
            if (source) {
                const data = new FormData();
                data.append('file', source);
                const uploadMedia = await axios.post(`/api/multimedia`, data, {
                    params: {
                        id: idTransaction,
                    }
                });
            }
            setTitle();
            setDescription();
            setSource();
            setOpen(false);
            update(Math.random());
        } catch (error) {
            console.error(`Error al crear paso:`, error);
        }
    };

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'small',
        trigger: render
    }

    return (
        <Modal {...modalProps}>
            <Modal.Header>
                Añadir nueva aplicación
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <input placeholder="Titulo" value={title} onChange={ev => setTitle(ev.target.value)} />
                    <input value={meta} onChange={ev => setMeta(ev.target.value)} type="text" placeholder="Meta Enlace" />
                    <input type="file" name="mediaManual" onChange={ev => {
                        setFilename(ev.target.files[0].name)
                        setSource(ev.target.files[0])
                    }} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button content="ACEPTAR" primary onClick={() => {
                    createAdvantage();
                }} />
            </Modal.Actions>
        </Modal>
    )
}


const AplicationsTable = ({ advantages = [], update, languages }) => {

    const deleteStep = async (id) => {
        try {
            const res = await axios.delete('/api/aplications', {
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
        <Table>
            <Table.Header>
                <Table.HeaderCell>TITULO</Table.HeaderCell>
                <Table.HeaderCell>DESCRIPCION</Table.HeaderCell>
                <Table.HeaderCell>IMAGEN</Table.HeaderCell>
                <Table.HeaderCell>OPCIONES</Table.HeaderCell>
            </Table.Header>

            <Table.Body>
                {
                    advantages.filter(entry => entry.language === languages).map((step, index) => {
                        const { title, description, source } = step;
                        return (
                            <Table.Row key={index} className="table-general">
                                <Table.Cell>{title}</Table.Cell>
                                <Table.Cell>{description}</Table.Cell>
                                <Table.Cell>
                                    {source && (
                                        <Image src={`/${source}`} className="miniature-image" />
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <Icon
                                        onClick={() => { deleteStep(step.idStep) }}
                                        size="large"
                                        color="grey"
                                        className="custom-dropdown__icon"
                                        name='trash'
                                    />
                                    <EditAdvantage
                                        update={update}
                                        step={step}
                                        render={<Icon size="large" color="grey" className="custom-dropdown__icon" name='pencil alternate' />}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        )
                    })
                }
            </Table.Body>
        </Table>
    )
};


const EditAdvantage = ({ render, update, step }) => {
    const [open, setOpen] = useState();
    const [title, setTitle] = useState(step.title);
    const [description, setDescription] = useState(step.description);

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'small',
        trigger: render
    };

    const submitForm = async () => {
        try {
            const save = await axios.put('/api/advantages', {
                title: title,
                description: description
            }, {
                params: {
                    id: step.idStep
                }
            });
            update(Math.random());
            setTitle('');
            setDescription('');
            setOpen(false);
        } catch (err) {
            console.error('Error al guardar comentario:', err);
        }
    };

    return (
        <Modal {...modalProps}>
            <Modal.Header>
                <Header>
                    Editar paso
                </Header>
            </Modal.Header>
            <Modal.Content>
                <Form>
                    <input placeholder="Titulo" value={title} onChange={ev => setTitle(ev.target.value)} />
                    <textarea value={description} onChange={ev => setDescription(ev.target.value)} placeholder="Descripcion" rows={4} />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={submitForm} primary content="ACEPTAR" />
            </Modal.Actions>
        </Modal>
    )
};

export default Aplications;