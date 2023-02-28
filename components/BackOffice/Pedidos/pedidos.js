import React, { useState, useEffect } from 'react';
import { Button, Grid, Header, Divider, Icon } from 'semantic-ui-react';
import { usePedidos } from "../../../hooks/usePedidos";
import ModalVerifyPedidos from "../ModalVerifyPedidos/index";

const Pedidos = () => {
    const [materialList, setMaterialList] = useState([]);
    const { list = [], getListPedidos } = usePedidos();

    const getMaterialList = () => {
        const handler = async () => {
            try {
                const { data } = await getMaterials();
            } catch (e) {
                console.error('Error al obtener lista de materiales:', e)
            }
        };
        handler();
        getListPedidos();
    };
    
    useEffect(() => {
        getMaterialList();
    }, []);

    return (
        <Grid columns="16" padded={true}>
            <Grid.Row>
                <Grid.Column width="8" style={{ paddingTop: '2rem' }}>
                    <Header>Administración de pedidos:</Header>
                </Grid.Column>
                
            </Grid.Row>
            <Divider />
            <Grid.Row>
                <Grid.Column computer={2}>
                    <p>
                        <b>ESTADO</b>
                    </p>
                </Grid.Column>
                <Grid.Column computer={3}>
                    <p>
                        <b>ID.PEDIDO</b>
                    </p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>
                        <b>FECHA DE CREACIÓN</b>
                    </p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>
                        <b>CLIENTE</b>
                    </p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>
                        <b>CONTACTO</b>
                    </p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>
                        <b>PRECIO TOTAL</b>
                    </p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>
                        <b>ACCIONES</b>
                    </p>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row >
                <Grid.Column width="16">
                   {
                       list?.list?.map((presupuesto) => (
                        <PresupuestoItem item={presupuesto}/>
                       ))
                   }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

const PresupuestoItem = ({ item }) => {
    const { idDelivery , verified,  informacionEnvio, paymentSelected, informacionPedido, creationDate } = item;
    const { completePedido } = usePedidos();

    const calculateTotal = () => {
        let priceTotal = 0;
        informacionPedido?.items.map(pedido => {
            priceTotal += pedido.total;
        })
        return priceTotal;
    };

    const validateDelivery = () => {
        completePedido(item.idDelivery);
    }
    
    return (
        <Grid columns="16">
            <Grid.Row className="adm-pedidos">
                <Grid.Column computer={2}>
                    <p>{verified ? (
                        <>
                            <Icon
                                color="green" 
                                name="check" 
                            /> Validado
                        </>
                    ) : (
                        <>
                            <Icon
                                color="red" 
                                name="x" 
                            /> Validar
                        </>
                    )}</p>
                </Grid.Column>
                <Grid.Column computer={3}>
                    <p>{idDelivery}</p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>{creationDate}</p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>{informacionEnvio?.name + ' ' +informacionEnvio?.lastname}</p>
                </Grid.Column>
                <Grid.Column computer={2}>
                    <p>{informacionEnvio?.phone}</p>
                </Grid.Column>
                <Grid.Column computer={1}>
                    <p>{parseInt(calculateTotal())}€</p>
                </Grid.Column>
                <Grid.Column computer={1} style={{ display: 'flex' , justifyContent: 'flex-start' }}>
                    <ModalVerifyPedidos verified={item.verified} item={item}/>
                    <Button onClick={validateDelivery} size="mini" color="green">Completar</Button>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default Pedidos;