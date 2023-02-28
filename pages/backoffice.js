import React, { useEffect, useState } from 'react';
import { Container, Grid, Header, Icon, Image, Button  } from 'semantic-ui-react';
import { BACKOFFICE_OPTIONS } from "../constants/backofficeMenu";
import Contact from '../components/BackOffice/Contact/Contact';
import Users from '../components/BackOffice/Users';
import Configuration from '../components/BackOffice/Configuration/Configuration';
import Material from '../components/BackOffice/Materials/';
import Blog from "../components/BackOffice/Blog/Blog";
import Pedidos from '../components/BackOffice/Pedidos/pedidos';
import Machines from '../components/BackOffice/Machines';
import Dashboard from '../components/BackOffice/Dashboard';
import { BASE_URL } from "../constants/config";
import { useBackoffice } from "../hooks/useBackoffice";
import { useRouter } from 'next/router'

const backoffice = () => {
    const [menuSelected, setMenuSelected] = useState(0)
    const history = useRouter();

    const { validateSession } = useBackoffice();
    
    useEffect(() => {
        document.getElementById('header-just').style.display = 'none';
        document.getElementById('footer-just').style.display = 'none';
        // validateSession()
    }, []);

    const closeSession = () => {
        // localStorage.removeItem('admin');
        // history.push('/');
    };
    
    return (
        <>
            <Container fluid className="backoffice">
                <Grid columns="16" className="backoffice__grid">
                    <Grid.Row className="backoffice__row">
                        <Grid.Column width="3" className="backoffice__menu">
                            <MenuBackOffice setMenuSelected={setMenuSelected} />
                        </Grid.Column>
                        <Grid.Column width="13" className="backoffice__content">
                            <Grid columns={16} className="backoffice__header">
                                <Grid.Row>
                                    <Grid.Column computer={16} className="content">
                                        <Header as="">PANEL DE ADMINISTRACIÓN</Header>
                                        <Button secondary onClick={closeSession}>
                                            Cerrar sesión
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            {menuSelected === 0 && (<Dashboard />)}
                            {menuSelected === 3 && (<Material />)}
                            {menuSelected === 4 && (<Pedidos />)}
                            {menuSelected === 5 && (<Users />)}
                            {menuSelected === 6 && (<Contact />)}
                            {menuSelected === 7 && (<Configuration />)}
                            {menuSelected === 8 && (<Blog />)}
                            {menuSelected === 9 && (<Machines />)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
};


// MENU DEL BACKOFFICE 
const MenuBackOffice = ({ setMenuSelected = () => { } }) => {
    return (
        <Grid columns="16" stackable className="menu-backoffice">
            <Grid.Column computer={16} className="menu-logo-backoffice">
                <div className="menu-logo-backoffice__container">
                    <Image src={`${BASE_URL}/logo.svg`} size="small" />
                </div>
            </Grid.Column>
            {BACKOFFICE_OPTIONS.map((menu, index) => (
                <Grid.Column onClick={() => setMenuSelected(menu.index)} width="16" key={index} className="menu-backoffice__item">
                    <div>
                        <Icon name={menu.icon} size="small" style={{ marginRight: '.5rem' }}/>
                        {menu.name}
                    </div>
                </Grid.Column>
            ))}
            <Grid.Column computer={16}>

            </Grid.Column>
        </Grid>
    )
};

// CABECERA DEL BACKOFFICE
const HeaderOffice = () => {
    return (
        <Container fluid className="header-backoffice">
            <Grid columns="16" className="header-backoffice__row">
                <Grid.Row >
                    <Grid.Column width="5">
                        <img className="header-backoffice__logo" src='./justlaserlogobackoffice.png' />
                    </Grid.Column>
                    <Grid.Column width="11">

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    )
};



export default backoffice;