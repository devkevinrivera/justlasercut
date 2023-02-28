import axios from 'axios';
import React , { useState , useEffect } from 'react'
import { Grid , Step, Container, Header, Icon, GridColumn, Checkbox, Input, Divider, Button } from 'semantic-ui-react'
import { STEPS_SHOPPING } from "../constants";
import { useSession, signIn, signOut } from "next-auth/react";
import DetailsBuy from './DetailsBuy';
import DetailsDelivery  from "./DetailsDelivery";
const { v4: uuidv4 } = require('uuid');
import moment from 'moment';

export default function StepTree({ active , setActive }) {
  const [optionShipping,setOptionShipping] = useState(0);
  const [deliveryList,setDeliveryList] = useState([]);
  const { data: session } = useSession();
  const [manager,setManager] = useState();

  const [paymentSelected,setPaymentSelected] = useState(null);
  
  const payments = [
    {
        title: 'VISA',
        id: 0,
        img: ''
    },
    {
        title: 'Bizum',
        id: 1,
        img: ''
    }
  ]

  const handlerPayment = async () => {
      const idDelivery = uuidv4();
      localStorage.setItem('idPedido', idDelivery);
      try {
        await axios.post('/api/pedidos' , {
            informacionPedido: JSON.parse(localStorage.getItem('cart')),
            calculoPrecios: JSON.parse(localStorage.getItem('calculate_prices')),
            informacionEnvio: JSON.parse(localStorage.getItem('delivery_x')),
            paymentSelected: paymentSelected,
            idDelivery: idDelivery,
            verified: false,
            session: session,
            creationDate: moment().format('DD-MM-YYYY')
        });
      } catch (err) {
          console.error(err);
      }
    setActive('Resumen');
  };

  return (
    <Container className='mt-4'>
        <Grid columns={16}>
            <Grid.Row>
                <Grid.Column computer={10} tablet={16}>
                    <Header as="h1">Método de pago</Header>
                    <p>Elige un método de pago.</p>
                    <Grid columns={16}>
                        <Grid.Row>
                            <Grid.Column computer={16}>
                                <section className='payment-container'>
                                    {
                                        payments.map(({ title , id  }) => (
                                            <div
                                                className={`${id === paymentSelected ? 'active' : ''}`} 
                                                onClick={() => setPaymentSelected(id)}>
                                                <p>{title}</p>
                                            </div>
                                        ))
                                    }
                                </section>
                            </Grid.Column>
                            <Grid.Column computer={16}>
                                <Button 
                                    primary
                                    onClick={() => {
                                        handlerPayment()
                                    }}
                                    disabled={paymentSelected === null} 
                                    floated='right' 
                                    className='btn-finish'>REALIZAR PEDIDO</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
                <Divider vertical></Divider>
                <Grid.Column  computer={6} tablet={16} mobile={16}>
                       <DetailsBuy delivery={manager}/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
  )
}

const DeliveryOption = ({ data , setManager, manager }) => {
    const { name ,id , first_estimated_delivery_date, price } = data;

    return (
        <Grid.Column computer={16} className="DeliveryOption">
            <Grid columns={16} className="DeliveryOption__column" verticalAlign="middle">
                <Grid.Row>
                    <Grid.Column computer={2}>
                        <Checkbox 
                            checked={id === manager?.id}
                            onClick={() => setManager(data)}
                        />
                    </Grid.Column>
                    <Grid.Column computer={11}>
                       <h3>{name}</h3>
                       <p>Fecha estimada de llegada: {first_estimated_delivery_date}</p>
                    </Grid.Column>
                    <Grid.Column computer={3}>
                        <p>{price.total_price} {price.currency}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Grid.Column>
    )
}

const BoxSelection = ({ size, route , onClick, title, active}) => {
    return (
        <Grid.Column computer={size} onClick={onClick} 
        className={`boxSelection ${active ? 'active_option': ''}`}>
            <Icon name={route} size="huge" />
            <span>{title}</span>
        </Grid.Column>
    )
}

