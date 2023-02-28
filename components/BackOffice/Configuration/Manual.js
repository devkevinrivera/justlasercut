import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Modal, Divider, Form, Image, Icon } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic'
import axios from "axios";
import { BASE_URL } from '../../../constants/config';
import { CKEditor } from 'ckeditor4-react';
import parse from 'html-react-parser';
import { useRouter } from 'next/dist/client/router';
const { v4: uuidv4 } = require('uuid');

const Manual = ({ option }) => {
    const { locale } = useRouter();
    const [updater, setUpdater] = useState();
    const [modalAdd, setModalAdd] = useState(false);
    const [language, setLanguage] = useState(locale);
    const [manualItems, setManualItems] = useState([]);

    const fetchItems = () => {
        const fetchManualItems = async () => {
            try {
                const fetchItems = await axios(`/api/manual`, {
                    params: {
                        language: language
                    }
                });
                const { data: { steps } } = fetchItems;
                setManualItems(steps);
            } catch (err) {
                console.error(`Error al obtener lista del manual: ${err}`)
            }
        };
        fetchManualItems();
    };

    useEffect(() => {
        fetchItems();
    }, [language]);
    useEffect(() => {
        fetchItems();
    }, [updater]);

    return (
        <>
            <Grid columns="16" className="boxed">
                <Grid.Row>
                    <Grid.Column width="12" verticalAlign="middle">
                        <Header style={{ marginBottom: '0px !important' }}>
                            CONFIGURACIÓN DEL MANUAL DE USUARIO
                        </Header>
                    </Grid.Column>
                    <Grid.Column width="4" style={{ display: 'flex', justifyContent: 'right' }} floated="right">
                        <ModalAddManual
                            primary
                            language={language}
                            rendered={<Button primary>+</Button>}
                            open={modalAdd}
                            setUpdater={setUpdater}
                            setOpen={setModalAdd}
                        />
                        <div className="languages">
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
                        <ManualTable setUpdater={setUpdater} manualItems={manualItems} language={language} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </>
    );
};

const ManualTable = ({ language, manualItems, setUpdater }) => {
    const [openItem, setOpenItem] = useState(false);

    const deleteStepManual = async (idManual) => {
        try {
            const request = await axios.delete(`${BASE_URL}api/manual`, {
                params: {
                    id: idManual
                }
            });
            setUpdater(Math.random());
        } catch (err) {
            console.error(`Error al eliminar paso del manual: ${err}`);
        }
    };

    return (
        <Table celled columns="16">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>ORDEN</Table.HeaderCell>
                    <Table.HeaderCell>TITULO</Table.HeaderCell>
                    <Table.HeaderCell>DESCRIPCIÓN</Table.HeaderCell>
                    <Table.HeaderCell>RECURSO</Table.HeaderCell>
                    <Table.HeaderCell>ACCIONES</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    manualItems.map((stepManual, index) => {
                        const { id, title, image, video, order, description, buttons, language } = stepManual;

                        return (
                            <Table.Row className="table-general">
                                <Table.Cell>{order}</Table.Cell>
                                <Table.Cell>{title}</Table.Cell>
                                <Table.Cell><div className="table-boxed">
                                    {parse(description)}
                                </div></Table.Cell>
                                <Table.Cell>
                                    {image && (
                                        <Image src={`${BASE_URL}/${image}`} className="miniature-image" />
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <ModalEditManual
                                        setUpdater={setUpdater}
                                        step={stepManual}
                                        open={openItem}
                                        setOpen={setOpenItem}
                                        rendered={<Icon size="large" color="grey" className="custom-dropdown__icon" name='pencil alternate' />}
                                        language={language}
                                    />
                                    <Icon
                                        onClick={() => { deleteStepManual(id) }}
                                        size="large"
                                        color="grey"
                                        className="custom-dropdown__icon"
                                        name='trash'
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

const ModalAddManual = ({ open, setOpen, rendered, language = 'ES', setUpdater }) => {
    const [primary, setPrimary] = useState(false);
    const [secondary, setSecondary] = useState(false);
    const [textArea, setTextArea] = useState('');
    const [loading, setLoading] = useState(false);
    const [multimedia, setMultimedia] = useState('');
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [text, setText] = useState(<p>Deje una descripción</p>);
    const [nameFile, setNameFile] = useState();
    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'large',
        trigger: rendered
    };

    const handleSubmitManual = (fields) => {
        setLoading(true);
        const extension = nameFile.split('.').pop() || '';
        const fetchManual = async () => {
            try {
                const id = uuidv4();
                const request = await axios.post(`/api/manual`, {
                    ...fields,
                    description: text,
                    language: language,
                    image: `${id}.${extension}`,
                    video: `${id}.${extension}`,
                    id: id
                });
                if (multimedia) {
                    const data = new FormData();
                    data.append('file', multimedia);
                    const uploadMedia = await axios.post(`/api/multimedia`, data, {
                        params: {
                            id: id,
                        }
                    });
                }
                setUpdater(Math.random());
                setLoading(false);
                reset();
                setPrimary(false);
                setSecondary(false);
                setTextArea('');
                setOpen(false);
            } catch (err) {
                console.error(`Error al crear nuevo paso del manual: ${err}`);
                setLoading(false);
                setOpen(false);
            }
        };
        fetchManual();
    };

    return (
        <Modal {...modalProps} className="manual-modal-add">
            <Modal.Header>
                <Header>Añadir nuevo paso del manual</Header>
            </Modal.Header>
            <Modal.Content>
                <p>Rellene los siguientes datos para crear un nuevo paso del manual
                    (Recuerde que dependiendo del idioma seleccionado se creara el paso para un idioma o otro).</p>
                <Form onSubmit={handleSubmit(handleSubmitManual)}>
                    <input placeholder="Numero del manual:" type="number" {...register("order")} />
                    <input type="text" {...register("title")} placeholder="Titulo del paso" />
                    <CKEditor
                        data={text}
                        onChange={evt => setText(evt.editor.getData())}
                    />
                    <div>
                        <p>Archivos multimedia:</p>
                        <input onChange={(ev) => {
                            setNameFile(ev.target.files[0].name)
                            setMultimedia(ev.target.files[0])
                        }} type="file" name="mediaManual" />
                    </div>
                    <div className="manual-modal-add__buttons">
                        <p className="primary">
                            ¿Desea añadir un boton primario?: <input type="checkbox" checked={primary} onChange={(ev) => setPrimary(ev.target.checked)} />

                            {primary && (<div>
                                <input {...register("buttons.primary.title")} placeholder="Titulo del boton" type="text" />
                                <input {...register("buttons.primary.href")} placeholder="Link del boton" type="text" />
                                <div>
                                    <label>
                                        Seleccione el color del boton:
                                        <input type="color" {...register("buttons.primary.color")} />
                                    </label>
                                </div>
                            </div>)
                            }
                        </p>
                        <p className="secondary">
                            ¿Desea añadir un boton secundario?: <input type="checkbox" checked={secondary} onChange={ev => setSecondary(ev.target.checked)} />
                            {secondary && (<div>
                                <input placeholder="Titulo del boton" type="text" {...register("buttons.secondary.title")} />
                                <input placeholder="Link del boton" type="text" {...register("buttons.secondary.href")} />
                                <div>
                                    <label>
                                        Seleccione el color del boton:
                                        <input type="color" {...register("buttons.secondary.color")} />
                                    </label>
                                </div>
                            </div>)
                            }
                        </p>
                    </div>
                    <Button loading={loading} type="submit" floated="right" content="GUARDAR" primary />
                </Form>
            </Modal.Content>
        </Modal>
    )
}

const ModalEditManual = ({ rendered, language = 'ES', step, setUpdater }) => {
    const [primary, setPrimary] = useState(typeof step.buttons?.primary?.title !== 'undefined' ? true : false);
    const [secondary, setSecondary] = useState(typeof step.buttons?.secondary?.title !== 'undefined' ? true : false);
    const [textArea, setTextArea] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [text, setText] = useState();

    useEffect(() => {
        setValue("order", step.order);
        setValue("title", step.title);

        setValue("buttons.primary.title", step.buttons?.primary?.title);
        setValue("buttons.primary.href", step.buttons?.primary?.href);
        setValue("buttons.primary.color", step.buttons?.primary?.color);

        setValue("buttons.secondary.title", step.buttons?.secondary?.title);
        setValue("buttons.secondary.href", step.buttons?.secondary?.href);
        setValue("buttons.secondary.color", step.buttons?.secondary?.color);
    }, [open]);

    const modalProps = {
        onClose: () => setOpen(false),
        onOpen: () => setOpen(true),
        open: open,
        size: 'large',
        trigger: rendered
    };

    const handleSubmitManual = (fields) => {
        setLoading(true);
        const fetchManual = async () => {
            try {
                const request = await axios.put('/api/manual', {
                    step: step.id,
                    ...fields,
                    description: text,
                    language: language
                });
                setUpdater(Math.random());
                setLoading(false);
                setOpen(false);
            } catch (err) {
                console.error(`Error al actualizar el paso del manual: ${err}`);
                setLoading(false);
                setOpen(false);
            }
        };
        fetchManual();
    };

    return (
        <Modal {...modalProps} className="manual-modal-edit">
            <Modal.Header>
                <Header>Editar paso del manual</Header>
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit(handleSubmitManual)}>
                    <input placeholder="Numero del manual:" type="number" {...register("order")} />
                    <input type="text" {...register("title")} placeholder="Titulo del paso" />
                    <CKEditor
                        initData={step.description}
                        data={text}
                        onChange={evt => setText(evt.editor.getData())}
                    />
                    <div className="manual-modal-edit__buttons">
                        <p className="primary">
                            ¿Desea añadir un boton primario?: <input type="checkbox" checked={primary} onChange={(ev) => setPrimary(ev.target.checked)} />

                            {primary && (<div >
                                <input {...register("buttons.primary.title")} placeholder="Titulo del boton" type="text" />
                                <input {...register("buttons.primary.href")} placeholder="Link del boton" type="text" />
                                <div>
                                    <label>
                                        Seleccione el color del boton:
                                        <input type="color" {...register("buttons.primary.color")} />
                                    </label>
                                </div>
                            </div>)
                            }
                        </p>
                        <p className="secondary">
                            ¿Desea añadir un boton secundario?: <input type="checkbox" checked={secondary} onChange={ev => setSecondary(ev.target.checked)} />
                            {secondary && (<div >
                                <input placeholder="Titulo del boton" type="text" {...register("buttons.secondary.title")} />
                                <input placeholder="Link del boton" type="text" {...register("buttons.secondary.href")} />
                                <div>
                                    <label>
                                        Seleccione el color del boton:
                                        <input type="color" {...register("buttons.secondary.color")} />
                                    </label>
                                </div>
                            </div>)
                            }
                        </p>
                    </div>
                    <Button loading={loading} type="submit" floated="right" content="ACTUALIZAR" primary />
                </Form>
            </Modal.Content>
        </Modal>
    )
}

export default Manual;