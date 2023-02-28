import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button, Header, Form, Image, Modal, Divider, Icon } from 'semantic-ui-react';
import { CKEditor } from 'ckeditor4-react';
import axios from 'axios';
import moment from 'moment/moment';
const { v4: uuidv4 } = require('uuid');

const BlogModal = () => {
    const [textArea, setTextArea] = useState('');
    const [open, setOpen] = React.useState(false)
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [multimedia, setMultimedia] = useState('');
    const [filename, setFilename] = useState();
    const [multipleFiles, setMultipleFiles] = useState();
    const [loading, setLoading] = useState(false);


    const [blocks,setBlocks] = useState([]);

    const createBlock = (ev) => {
        setBlocks([
            ...blocks,
            {
                id: uuidv4(),
                titular: ev.title,
                datePublication: moment(),
                content: ev.textArea,
                gallery: ev.multipleFiles
            }
        ])
    };

    const onSubmit = async (info) => {
        const extension = filename ? filename?.split('.').pop() : '';
        const id = uuidv4();
        try {
            const request = await axios.post('/api/blog', {
                ...info,
                content: textArea,
                image: `${id}.${extension}`,
                id: id
            });
            const data = new FormData();
            if (multimedia && multipleFiles) {
                console.log(multipleFiles.length)
                let account = 0;

                for (const file of multipleFiles) {
                    data.append('file', file);
                }

                await axios.post('/api/multiplemedia', data, {
                    params: {
                        id: id,
                        folder: 'services'
                    }
                });
            }
            reset();
            setTextArea('');
            setLoading(false);
            setMultimedia();
            setOpen(false);
        } catch (err) {
            console.error(`Error al crear nuevo paso del manual: ${err}`);
            setLoading(false);
            setOpen(false);
        }
    };
    console.log(blocks)
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button primary content='+ Añadir entrada' />}
        >
            <Modal.Header>Crear Entrada del Blog</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Header>1. CREACIÓN DE CABECERA PRINCIPAL</Header>
                        <div style={{ marginBottom: '2rem' }}>
                            <select {...register("language")}>
                                <option value="es">Español</option>
                                <option value="en">Ingles</option>
                            </select>
                        </div>
                        <input style={{ marginBottom: '1rem' }} placeholder='Titulo'  {...register("title")} />
                        <input style={{ marginBottom: '1rem' }} placeholder='Subtitulo'  {...register("subtitle")} />
                        <CKEditor
                            data={textArea}
                            onChange={evt => setTextArea(evt.editor.getData())}
                            style={{
                                marginBottom: '1rem'
                            }}
                        />
                        <input
                            style={{ marginBottom: '1rem' }}
                            onChange={ev => {
                                setFilename(ev.target.files[0].name);
                                setMultimedia(ev.target.files[0]);
                                setMultipleFiles(ev.target.files)
                            }} type="file" name="mediaService" multiple />
                        <Divider />

                        <Header>2. CREACIÓN DE BLOQUES</Header>
                        {
                            blocks.map((entry) => <p>{entry.id}</p>)
                        }
                        <BlockCreator createBlock={createBlock}/>
                        
                        <Button onClick={() => createBlock()}><Icon name="plus" />Crear nuevo bloque</Button>
                        <Divider />
                        <input
                            type='submit'
                        />
                    </Form>
                </Modal.Description>
            </Modal.Content>

        </Modal>
    )
};

const BlockCreator = ({ createBlock }) => {
    const [textArea, setTextArea] = useState('');
    const [multimedia, setMultimedia] = useState('');
    const [filename, setFilename] = useState();
    const [multipleFiles, setMultipleFiles] = useState();
    const [title,setTitle] = useState();

    return (
        <div className='block-creator'>
            <input value={title} onChange={(ev) => setTitle(ev.target.value)} style={{ marginBottom: '1rem' }} placeholder='Titulo' />
            <CKEditor
                    data={textArea}
                    onChange={evt => setTextArea(evt.editor.getData())}
                    style={{
                        marginBottom: '1rem'
                    }}
                    />
                    <input style={{ marginBottom: '1rem' }} placeholder='Justtip' />
                    <input
                        style={{ marginBottom: '1rem' }}
                        onChange={ev => {
                            setFilename(ev.target.files[0].name);
                        setMultimedia(ev.target.files[0]);
                        setMultipleFiles(ev.target.files)
                    }} type="file" name="mediaService" multiple />
                    <Button onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        createBlock({
                            textArea, multipleFiles, title
                        })
                    }}>CREAR</Button>
        </div>

    )
}
export default BlogModal;