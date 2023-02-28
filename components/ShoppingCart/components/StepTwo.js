import axios from 'axios';
import React , { useState , useEffect } from 'react'
import { Grid , Step, Container, Header, Icon, GridColumn, Checkbox, Input, Divider } from 'semantic-ui-react'
import { STEPS_SHOPPING } from "../constants";
import DetailsBuy from './DetailsBuy';
import DetailsDelivery  from "./DetailsDelivery";

export default function StepTwo({ active , setActive }) {
  const [optionShipping,setOptionShipping] = useState(0);
  const [deliveryList,setDeliveryList] = useState([]);

  const [manager,setManager] = useState();

  const getDeliveryPrices = () => {
      const getDeliveryOptions = async () => {
        const { data } = await axios.get(`
        https://api.packlink.com/v1/services?platform=PRO&platform_country=ES&from[country]=ES&from[zip]=46019&packages[0][height]=32&packages[0][length]=23&packages[0][weight]=23&packages[0][width]=32&sortBy=totalPrice&source=PRO&to[country]=ES&to[zip]=20280
        `)
        setDeliveryList(data)
      }
      getDeliveryOptions();
  }

  useEffect(() => {
      getDeliveryPrices()
  },[])
  
  return (
    <Container className='mt-4'>
        <Grid columns={16}>
            <Grid.Row>
                <Grid.Column computer={10} tablet={16} mobile={16}>
                       <Header as="h1">Opciones de envío</Header>
                       <p>Elige una de las opciones de envío.</p>
                       
                       <Grid columns={16} >
                            <Grid.Row className="pl-1">
                                <BoxSelection 
                                    size={7}
                                    route='truck'
                                    onClick={() => {
                                        setOptionShipping(0);
                                        localStorage.setItem('takeAway',false);
                                    }}
                                    title="Envío a domicilio"
                                    active={optionShipping === 0}
                                />
                                <GridColumn computer={2}></GridColumn>
                                <BoxSelection 
                                    size={7}
                                    route='home'
                                    title="Recoger en tienda"
                                    onClick={() => {
                                        setOptionShipping(1);
                                        setManager();
                                        localStorage.setItem('takeAway',true);
                                    }}
                                    active={optionShipping === 1}
                                />
                            </Grid.Row>
                            {
                                optionShipping === 0 && (
                                <Grid.Row className="pl-1">
                                    {
                                        deliveryList.map((option,index) => (
                                            index < 4 &&  (
                                            <DeliveryOption 
                                                manager={manager}
                                                setManager={setManager}
                                                data={option}/>)
                                        ))
                                    }
                                </Grid.Row>
                                )
                            }
                       </Grid>
                       <DetailsDelivery shipping={optionShipping === 0}  setActive={setActive}/>
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

