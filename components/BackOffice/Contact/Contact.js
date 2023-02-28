import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Grid, Header, Divider, Table, Icon, Modal, Button, Image, Checkbox, Message } from "semantic-ui-react";
import { BASE_URL } from '../../../constants/config';

const Contact = () => {
    const [messagesList, setMessagesList] = useState([]);
    const [updater, setUpdater] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios(`${BASE_URL}api/contact`);
                setMessagesList(response.data.messagesList)
            } catch (err) {
                setError(true);
            }
        }
        fetchMessages();
    }, [updater]);

    return (
        <Grid columns="16" className="backoffice-contact">
            <Grid.Row>
                <Grid.Column width="16">
                    <Header>ADMINISTRACIÓN DE MENSAJES</Header>
                    <Divider />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="backoffice-contact__messages-table">
                <Grid.Column width="16">
                    <MessagesTable
                        messagesList={messagesList}
                        updater={updater}
                        setUpdater={setUpdater}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const MessagesTable = ({ messagesList, updater, setUpdater }) => {
    const deleteMessage = (id) => {
        const deleteMessageById = async () => {
            try {
                const requestMessage = await axios.delete(`/api/contact`, {
                    params: {
                        idMessage: id
                    }
                });
                if (requestMessage.status === 200) {
                    setUpdater(Math.random());
                };
            } catch (err) {
                console.error(`Error al eliminar mensaje: ${err}`);
            }
        };
        deleteMessageById();
    };

    return (
        <>

            <Table celled columns="16">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>LEIDO</Table.HeaderCell>
                        <Table.HeaderCell>ASUNTO</Table.HeaderCell>
                        <Table.HeaderCell>EMAIL</Table.HeaderCell>
                        <Table.HeaderCell>FECHA</Table.HeaderCell>
                        <Table.HeaderCell>MENSAJE</Table.HeaderCell>
                        <Table.HeaderCell>OPCIONES</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        messagesList.map((messageItem, index) => {
                            const { email, subject, message, date = '', idMessage, isRead = false } = messageItem;
                            return (
                                <Table.Row key={index} >
                                    <Table.Cell>{isRead ? 'SI' : 'NO'}</Table.Cell>
                                    <Table.Cell>{subject}</Table.Cell>
                                    <Table.Cell>{email}</Table.Cell>
                                    <Table.Cell>{date}</Table.Cell>
                                    <Table.Cell>{message}</Table.Cell>
                                    <Table.Cell>
                                        <ModalMessage
                                            setUpdater={setUpdater}
                                            deleteMessage={deleteMessage}
                                            message={messageItem}
                                            render={<Icon size="large" color="grey" className="custom-dropdown__icon" name='eye' />} />
                                        <Icon
                                            onClick={() => deleteMessage(idMessage)}
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
        </>
    )
};

const ModalMessage = ({ render, message, deleteMessage, setUpdater }) => {
    const [open, setOpen] = useState(false)
    const [isChecked, setIsChecked] = useState(message.isRead);

    const EditStatusItemMessage = () => {

        const request = async () => {
            try {
                const response = await axios.put(`/api/contact`, {
                    readStatus: isChecked
                }, {
                    params: {
                        idMessage: message.idMessage
                    }
                });
                if (response.status === 200) {
                    setUpdater(Math.random());
                    setOpen(false)
                };
            } catch (err) {
                console.error(`Error al editar el estado del mensaje: ${err}`)
            }
        };
        request();
    };

    useEffect(() => {
        EditStatusItemMessage()
    }, [isChecked])

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={render}
            className="message-modal"
        >
            <Modal.Header className="message-modal__header">
                <div>
                    <Header>{message.subject}</Header>
                </div>
                <div>
                    <Icon onClick={() => {
                        deleteMessage(message.idMessage);
                        setOpen(false);
                    }} color="grey" className="custom-dropdown__icon" name='trash' />
                    <Checkbox toggle defaultChecked={isChecked} onChange={() => setIsChecked(!isChecked)} defaultChecked={isChecked} />
                </div>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <Header>{message.email} - {message.date}</Header>
                    <p>
                        {message.message}
                    </p>
                </Modal.Description>

                <Button
                    as='a'
                    download='adjunto.png'
                    href={`${BASE_URL}api/download?filename=${message.filename}`}
                    content='Descargar' />
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="ACEPTAR"
                    onClick={() => setOpen(false)}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default Contact;