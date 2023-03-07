import React, { useState, useEffect } from 'react';
import { Grid, Container, Header, Icon, Form, Divider, Button, Image } from "semantic-ui-react";
import { useSession, signIn, singOut, getSession, signOut,  Item  } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router'
import { usePedidos } from "../hooks/usePedidos"
import { useMaterial } from "../hooks/useMaterial"
import { BASE_URL } from "../constants/config";

const perfil = () => {
    const [user, setUser] = useState();
    const { data: session } = useSession();

    const [update, setUpdate] = useState();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
            return
        }
        const handler = async () => {
            const { data } = await axios('/api/customers');
            const user = data?.request?.filter((user) => user?.email === session?.user?.email)[0];
            setUser(user)
        };
        handler();
    }, [session, update]);

    return (
        <Container style={{ minHeight: '90vh' }}>
            <Header style={{ marginBottom: '4rem' }}>
                Mi cuenta
            </Header>
            <Orders />
            <DataPersonal user={user} setUpdate={setUpdate} />
            <UserAddress user={user} setUpdate={setUpdate} />
            <Button
                style={{ marginBottom: '2rem' }}
                color='red'
                onClick={() => {
                    signOut()
                }} content='Cerrar Sesión' />
        </Container>
    );
};


const UserAddress = ({ user, setUpdate }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    const onSubmit = async (data) => {
        try {
            const putDataPersonal = await axios.put(`/api/customers`, {
                adressess: [
                    ...user.address,
                    {
                        id: uuidv4(),
                        ...data
                    }
                ],
                id: user.id
            })
            setUpdate(Math.random())
        } catch (err) {
            console.error(err)
        }
    };

    useEffect(() => {
        setValue('email', user?.email);
        setValue('name', user?.name);
        setValue('phone', user?.phone);
    }, [user]);

    return (
        <Grid columns="16">
            <Grid.Row style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#eee', paddingBottom: '0px',
                justifyContent: 'center', marginBottom: '5rem'
            }}>
                <Grid.Column width="16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Header>2.Mis direcciones</Header>
                    <Icon size="large" className="custom-dropdown__icon" name='plus' onClick={() => setOpen(!open)} />
                </Grid.Column>
                {
                    open && (
                        <>
                            <Grid.Column width="16" style={{ border: '1px solid #eee', backgroundColor: 'white', padding: '2rem' }}>
                                <section>
                                    <h3>Añadir nueva dirección</h3>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <input style={{ marginBottom: '1rem' }} {...register('address')} placeholder="Dirección" />
                                        <input style={{ marginBottom: '1rem' }} {...register('number')} placeholder="Piso/Puerta u otro" />
                                        <input style={{ marginBottom: '1rem' }} {...register('cp')} placeholder="Codigo postal" />
                                        <input style={{ marginBottom: '1rem' }} {...register('locality')} placeholder="Localidad" />
                                        <input type="submit" />
                                    </Form>
                                </section>
                            </Grid.Column>
                            <Divider />
                            <Grid.Column width="16" style={{ border: '1px solid #eee', backgroundColor: 'white', padding: '2rem' }}>
                                <div style={{ margin: '0px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                                    {
                                        user?.adressess?.map((address, index) => (

                                            <p>{index + 1}) Calle: {address.address} | Número: {address.number} | CP: {address.cp} | Localidad: {address.locality} </p>

                                        ))
                                    }
                                </div>
                            </Grid.Column>
                        </>
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

const DataPersonal = ({ user }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    const onSubmit = async (data) => {
        try {
            const putDataPersonal = await axios.put(`/api/customers`, {
                ...data,
                id: user.id
            })
        } catch (err) {
            console.error(err)
        }
    };

    useEffect(() => {
        setValue('email', user?.email);
        setValue('name', user?.name);
        setValue('phone', user?.phone);
    }, [user]);

    return (
        <Grid columns="16">
            <Grid.Row style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#eee', paddingBottom: '0px',
                justifyContent: 'center', marginBottom: '1rem'
            }}>
                <Grid.Column width="16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Header>2.Mis datos personales</Header>
                    <Icon size="large" className="custom-dropdown__icon" name='plus' onClick={() => setOpen(!open)} />
                </Grid.Column>
                {
                    open && (
                        <Grid.Column width="16" style={{ border: '1px solid #eee', backgroundColor: 'white', padding: '2rem' }}>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <input style={{ marginBottom: '1rem' }} {...register('email')} placeholder="Email" />
                                <input style={{ marginBottom: '1rem' }} {...register('name')} placeholder="Nombre" />
                                <input type="number" style={{ marginBottom: '1rem' }} {...register('phone')} placeholder="Telefono" />
                                <input type="submit" />
                            </Form>
                        </Grid.Column>
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

const Orders = () => {
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const { data: session  } = useSession();
  
    const { list = [], getListPedidos} = usePedidos();

    useEffect(() => {
        getListPedidos();
    },[])

   
    
    useEffect(() => {
        if(!list || !session) return
        const { user : { email : emailSession} } = session;
        const { list : listaPedidos } = list;

        const myPedidos = listaPedidos?.filter(pedido => pedido?.session?.user?.email === emailSession);
        setOrders(myPedidos)

    },[list,session]);


    return (
        <Grid columns="16">
            <Grid.Row style={{
                marginBottom: '1rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#eee', paddingBottom: '0px',
                justifyContent: 'center'
            }}>
                <Grid.Column width="16" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Header>1.Mis pedidos</Header>
                    <Icon size="large" className="custom-dropdown__icon" name='plus' onClick={() => setOpen(!open)} />
                </Grid.Column>
                {
                    open && (
                        <Grid.Column width="16" style={{ border: '1px solid #eee', backgroundColor: 'white', padding: '2rem' }}>
                                {
                                    orders?.length ? 'Listado de pedidos' : 'Actualmente no tiene ningun pedido.'
                                }
                                {
                                    orders?.map((order) => <MyPedido item={order}/>)
                                }
                        </Grid.Column>
                    )
                }
            </Grid.Row>
        </Grid>
    )
}

const MyPedido = ({ item }) => {
    const { informacionEnvio , informacionPedido, creationDate, calculoPrecios, paymentSelected, verified } = item;
    const { list : listMaterials ,  getMaterialList} = useMaterial(); 

    useEffect(() => {
        getMaterialList();
    },[])

    const getMaterialName = (id) => {
        const find = listMaterials?.find(material => material?.id === id);
        return find?.title?.es
    }

    return (
        <Grid columns={16} className="my-pedido">
            {
                informacionPedido.items.map(({ copias , file , ...props}) => (
                    <Grid.Row>
                        <Grid.Column computer={3}>
                            <Image src={`${BASE_URL}/${file.previsualization}`} size="large" />
                        </Grid.Column>
                        <Grid.Column computer={5}>
                            <h5>Información del proyecto</h5>
                            <p>
                                <b>Precio de corte:</b> {parseInt(props.total)}€
                            </p>
                            <p>
                                <b>Material seleccionado:</b> {getMaterialName(props.material)}
                            </p>
                            <p>
                                <b>Grosor del material:</b> {props.weight}mm
                            </p>
                        </Grid.Column>
                        <Grid.Column computer={5}>
                            <h5>Información del pedido</h5>
                            <p>
                                <b>Estado del pedido:</b> {verified ? (
                                    <>
                                        <Icon name="check" color="green" /> Verificado
                                    </>
                                ) : (
                                    (
                                        <>
                                            <Icon name="x" color="red" /> En revisión
                                        </>
                                    )
                                )}
                            </p>
                            <p>
                                <b>Fecha de creación:</b> {item.creationDate}
                            </p>
                            <p>
                                <b>Metodo de pago:</b>  {paymentSelected === 0 ? 'Targeta' : 'Bizum'}
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                ))
            }
        </Grid>
    )
}

export default perfil;