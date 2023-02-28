import React, { useState } from 'react';
import { Grid, Menu, Divider, Header, Table } from "semantic-ui-react";
import { BASE_URL } from '../../../constants/config';
import FeedBack from './FeedBack';
import Manual from './Manual';
import Services from "./Services";
import SiteForm from './SiteForm';
import Steps from './Steps';
import Gallery from './Gallery';
import Advantages from '../../Advantages/Advantages';
import AdvantagesBackoffice from './AdvantagesBackoffice';
import TecnologiesGallery from './TecnologiesGallery';
import Aplications from './Aplications';
import BannersPromocionales from './BannersPromocionales';

const Configuration = () => {
    const [option, setOption] = useState(0);

    return (
        <Grid columns="16" className="backoffice-configuration">
            <Grid.Row>
                <Grid.Column width="16">
                    <Header>ADMINISTRACIÓN DE LA WEB</Header>
                    <Divider />
                    <Menu>
                        <Menu.Item
                            onClick={() => setOption(0)}
                            name='Datos del sitio'
                        />
                        <Menu.Item
                            onClick={() => setOption(1)}
                            name='Manual'
                        />
                        <Menu.Item
                            onClick={() => setOption(2)}
                            name='Servicios'
                        />
                        <Menu.Item
                            onClick={() => setOption(3)}
                            name='Opiniones'
                        />
                        <Menu.Item
                            onClick={() => setOption(4)}
                            name='Pasos'
                        />
                        <Menu.Item
                            onClick={() => setOption(5)}
                            name='Galeria'
                        />
                        <Menu.Item
                            onClick={() => setOption(6)}
                            name='Ventajas'
                        />
                        <Menu.Item
                            onClick={() => setOption(7)}
                            name='Tecnologias'
                        />
                        <Menu.Item
                            onClick={() => setOption(8)}
                            name='Aplicaciones'
                        />
                        <Menu.Item
                            onClick={() => setOption(9)}
                            name='Banners'
                        />
                    </Menu>
                    <Divider />
                    {option === 0 && (<SiteForm option={option} />)}
                    {option === 1 && (<Manual option={option} />)}
                    {option === 2 && (<Services option={option} />)}
                    {option === 3 && (<FeedBack option={option} />)}
                    {option === 4 && (<Steps option={option} />)}
                    {option === 5 && (<Gallery option={option} />)}
                    {option === 6 && (<AdvantagesBackoffice option={option}/>)}
                    {option === 7 && (<TecnologiesGallery option={option}/>)}
                    {option === 8 && (<Aplications option={option}/>)}
                    {option === 9 && (<BannersPromocionales option={option}/>)}
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default Configuration;