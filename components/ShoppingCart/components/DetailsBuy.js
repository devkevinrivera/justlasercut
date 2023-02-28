import React  , { useState , useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Container, Divider, Grid, Header, Image } from 'semantic-ui-react'

export default function DetailsBuy({ delivery }) {
    const pedido = JSON.parse(localStorage.getItem('cart'));
    
    const [priceIva,setPriceIva] = useState(0);
    
    const [subtotal,setSubtotal] = useState(0);
    const [total,setTotal] = useState(0);

    useEffect(() => {
        let subtotal = 0;
        pedido.items.map(({ total }) => {
            subtotal += parseInt(total);
        })

        let totalIva = (((parseInt(subtotal) + delivery?.price?.total_price || 10) * 20) / 100) ;

        setTotal(totalIva + subtotal)
        setPriceIva(parseInt(totalIva));
        setSubtotal(subtotal);
        localStorage.setItem('calculate_prices' , JSON.stringify(
            {
                subtotal: subtotal,
                totalIva: totalIva,
                delivery: delivery
            }
        ))
        localStorage.setItem('envio' , JSON.stringify({
            delivery
        }))
    },[delivery])
    
    
    return (
        <Grid className='details-buy'>
            <Grid.Row>
                <Grid.Column className="details-buy__container">
                    <section>
                            <Header as="h1">Resumen del pedido</Header>
                            <p className='text-resume'>Subtotal: <span>{subtotal} €</span></p>
                            {delivery?.price.total_price && (
                                <p className='text-resume'>Envío: <span>{delivery?.price.total_price} €</span></p>
                            )}
                            <p className='text-resume'>IVA (20%): <span>{priceIva || subtotal} €</span></p>
                            <p></p>
                            <p className='text-resume'><b>Total del pedido: </b><span>{parseInt(total) || 0} €</span></p>

                            <Divider />
                    </section>
                    {delivery && (
                        <section>
                            <Header as="h1">Datos de envío</Header>
                            <p className='text-resume'>Entrega estimada: 
                                <span>{delivery?.first_estimated_delivery_date} </span></p>
                            <p className='text-resume'>Empresa de envio: <span>{delivery?.carrier_name}</span></p>

                            <Divider />

                            <Header as="h1">Tu cesta ({pedido?.items?.length === 1 ? pedido?.items?.length + ' artículo': pedido?.items?.length +' artículos'})</Header>

                            {
                                pedido?.items?.map((pedido) => (
                                    <Item pedido={pedido}/>
                                ))
                            }
                        </section>
                    )}
                </Grid.Column>
            </Grid.Row>
        </Grid>
  )
}

const Item = (pedido) => {

    const { file = '' , pedido : mipedido} = pedido;
    
    return (
        <Grid columns={16}>
            <Grid.Row>
                <Grid.Column width={4}>
                    <Image src={mipedido?.file?.previsualization} />     
                </Grid.Column>
                <Grid.Column width={12}>
                    <p>Nombre: <span>{mipedido?.name || '(VACIO)'}</span></p>
                    <p>Núm Planchas: <span>{mipedido?.file?.planchas?.length || '(VACIO)'}</span></p>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}