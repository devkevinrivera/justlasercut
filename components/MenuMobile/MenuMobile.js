import React from 'react';
import { Container, Grid, Icon, Menu, Dropdown, Divider, Image } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { BASE_URL } from "../../constants/config";

const MenuMobile = ({ show = false , setShow }) => {
    const history = useRouter()

    return (
        <div className={`menu-mobile ${show ? '' : 'menu-mobile-hide'}`}>
            <section className="menu-mobile__actions">
                <Image src={`${BASE_URL}/JustLaseLogo.png`} className="mobile-logo" />
                <Icon name="close" size="big"  onClick={() => setShow(false)} />
            </section>
            <Divider />
            <Menu vertical>
                <Menu.Item onClick={() => {
                    history.push('/');
                    setShow(false);
                }}>Inicio</Menu.Item>
                <Menu.Item onClick={() => {
                    history.push('/manual');
                    setShow(false);
                }}>Tutorial</Menu.Item>
                <Menu.Item onClick={() => {
                    history.push('/materiales');
                    setShow(false);
                }}>Materiales</Menu.Item>
                <Menu.Item onClick={() => {
                    history.push('/servicios');
                    setShow(false);
                }}>Servicios</Menu.Item>
                <Menu.Item onClick={() => {
                    history.push('/blog');
                    setShow(false);
                }}>Blog</Menu.Item>
                <Menu.Item onClick={() =>{ 
                    history.push('/proyectos');
                    setShow(false);
                }}>Proyectos</Menu.Item>
            </Menu>
       </div>
    );
};

export default MenuMobile;