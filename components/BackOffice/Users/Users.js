import axios from 'axios';
import moment from 'moment';
import React, { useEffect , useState } from 'react';
import { Grid , Header , Table , Label , Menu} from "semantic-ui-react";
import { BASE_URL } from '../../../constants/config';

const Users = () => {
    const [users,setUsers] = useState([]);
    useEffect(() => getUsers(),[]);
    
    const getUsers = () => {
        const getUserList = async () => {
            try {
                const users = await axios.post(`/api/backoffice`, { users: true });
                const { data } = users;
                setUsers(data.users)
            } catch (err) {
                console.error(`Error al obtener lista de usuarios: ${error}`)
            }
        };
        getUserList();
    };

    return (
        <Grid columns="16" className="backoffice-contact">
            <Grid.Row>
                <Grid.Column width="16">
                    <Header>ADMINISTRACIÓN DE USUARIOS</Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column width="15">
                    <UsersTable users={users}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const UsersTable = ({ users }) => {

    return (
        <Table celled columns="16">
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>NOMBRE</Table.HeaderCell>
                    <Table.HeaderCell>EMAIL</Table.HeaderCell>
                    <Table.HeaderCell>FECHA DE REGISTRO</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            
            <Table.Body>
                {
                    users.map((user,index) => {
                        const { name, email } = user;
                        return (
                            <Table.Row key={index} onClick={() => console.log('pepas  ')}>
                                <Table.Cell>{name}</Table.Cell>
                                <Table.Cell>{email}</Table.Cell>
                                <Table.Cell>{moment().format('DD-MM-YYYY')}</Table.Cell>
                            </Table.Row>
                        )
                    })
                }
                
            </Table.Body>
        </Table>
    )
}

export default Users;