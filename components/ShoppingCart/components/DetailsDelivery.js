
import React , { useState , useMemo } from "react";
import { Grid , Form, Header, GridColumn, Divider, Input, Button } from 'semantic-ui-react'
import { useForm } from "react-hook-form";
import countryList from 'react-select-country-list'
import Select from 'react-select'

export default function DetailsDelivery({ setActive , shipping  }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [value, setValue] = useState('')
    const options = useMemo(() => countryList().getData(), [])
  
    const changeHandler = value => {
      setValue(value)
    }

    const onSubmit = data => {
        localStorage.setItem('delivery_x',JSON.stringify({
            ...data,
            delivery: JSON.parse(localStorage.getItem('envio')),
            countrySelected: value,
            user: JSON.parse(localStorage.getItem('session')),
            shipping
        }));

        setActive('Pago')
    };


    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Grid columns={16}>
                    {shipping && (<>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                <Header>Detalles de envío</Header>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                        <Grid.Column width={8}>
                            <Select 
                                options={options} 
                                value={value} 
                                onChange={changeHandler} 
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input
                                type="number" 
                                placeholder='Teléfono' 
                                {...register("phone", { required: true })}
                                fluid/>
                        </Grid.Column>
                    </Grid.Row>
                    
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <input placeholder='Nombre' 
                            {...register("name", { required: true })} fluid/>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input placeholder='Apellido' 
                            {...register("lastname", { required: true })} fluid/>
                        </Grid.Column>
                    </Grid.Row>
                    
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <input 
                                {...register("address", { required: true })}
                                placeholder='Dirección' fluid/>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input
                                {...register("addressComplement", { required: true })} 
                                placeholder='Piso/Puerta u otro (opcional)' fluid/>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Input placeholder='Provincia' fluid/>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Input placeholder='Localidad' fluid/>
                        </Grid.Column>
                    </Grid.Row></>)}
                    
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Button type="submit" floated="right" primary>Continuar</Button>
                        </Grid.Column>
                        <Divider />
                    </Grid.Row>
            </Grid>
        </Form>
    )
}
