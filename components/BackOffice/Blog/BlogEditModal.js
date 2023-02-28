import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button, Header, Form, Image, Modal } from 'semantic-ui-react';
import { CKEditor } from 'ckeditor4-react';
import axios from 'axios';
const { v4: uuidv4 } = require('uuid');

const BlogEditModal = ({ entry, setUpdater }) => {
    const [textArea, setTextArea] = useState(entry.content);
    const [open, setOpen] = React.useState(false)
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const [multimedia, setMultimedia] = useState('');
    const [filename, setFilename] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(entry)
        setValue('title', entry.title)
        setValue('subtitle', entry.subtitle)
        setValue('language', entry.language)
    }, [entry])

    const onSubmit = async (info) => {
        const extension = filename ? filename?.split('.').pop() : '';
        const id = uuidv4();

        try {
            const request = await axios.put('/api/blog', {
                ...info,
                content: textArea
            }, {
                params: {
                    id: entry.id
                }
            });
            const data = new FormData();

            reset();
            setLoading(false);
            setMultimedia();
            setOpen(false);
            setUpdater(Math.random());
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
            trigger={<Button primary content='Editar' />}
        >
            <Modal.Header>Editar entrada del Blog</Modal.Header>
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
                            initData={entry.content}
                            onChange={evt => setTextArea(evt.editor.getData())}
                            style={{
                                marginBottom: '1rem'
                            }}
                        />

                        <input
                            type='submit'
                        />
                    </Form>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
};

export default BlogEditModal;