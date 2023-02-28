import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Button, Header, Form, Image, Modal } from 'semantic-ui-react';
import { CKEditor } from 'ckeditor4-react';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

const BlogModal = () => {
    const [textArea, setTextArea] = useState('');
    const [open, setOpen] = React.useState(false)
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const [multimedia, setMultimedia] = useState('');
    const [filename, setFilename] = useState();
    const [loading, setLoading] = useState(false);

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
            if (multimedia) {
                data.append('file', multimedia);
                await axios.post('/api/multimedia', data, {
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
                    <Header></Header>
                    <Form onSubmit={handleSubmit(onSubmit)}>
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
                            }} type="file" name="mediaService" />
                        <input
                            type='submit'
                        />
                    </Form>
                </Modal.Description>
            </Modal.Content>

        </Modal>
    )
};

export default BlogModal;