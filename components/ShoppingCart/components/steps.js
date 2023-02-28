import React , { useState } from 'react'
import { Grid , Step, Container } from 'semantic-ui-react'
import { STEPS_SHOPPING } from "../constants";

export default function Steps({ active , setActive }) {
    

  const handleClick = (e, { title }) => setActive(title);

  return (
    <Container >
        <Grid columns={16}>
            <Grid.Row>
                <Grid.Column computer={16} tablet={16} mobile={16} className="no-padding step-content">
                    <Step.Group stackable='tablet'>
                        <Step
                            active={active === 'Registro'}
                            icon='user plus'
                            onClick={handleClick}
                            title='Registro'
                            description='Comprar como invitado o Registrate'
                        />
                        <Step
                            active={active === 'Opciones de envío'}
                            icon='credit card'
                            onClick={handleClick}
                            title='Opciones de envío'
                            description='Elige una de las opciones de envío.'
                        />
                        <Step
                            active={active === 'Pago'}
                            icon='payment'
                            onClick={handleClick}
                            title='Pago'
                            description='Elige un método de pago.'
                        />
                        <Step
                            active={active === 'Resumen'}
                            icon='clipboard'
                            onClick={handleClick}
                            title='Resumen'
                            description='Confirmación de compra'
                        />
                    </Step.Group>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Container>
  )
}

