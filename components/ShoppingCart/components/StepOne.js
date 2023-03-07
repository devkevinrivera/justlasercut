import React, { useState } from 'react'
import { Container, Grid, Header, Input, Form, Button, Icon, Divider, Message } from 'semantic-ui-react'
import { session, signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/router';
import { BASE_URL } from '../../../constants/config';

const languages = {
    'es': require('../../../locale/es/commons.json'),
    'en': require('../../../locale/en/commons.json'),
};

export default function StepOne() {
    const { locale } = useRouter();
    const [error, setError] = useState(false);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const t = languages[locale];
    const { data: session } = useSession();
    
    const iniciarSesion = () => {
        setLoading(true);
        signIn('credentials',
        {
            username: email,
            password: password,
            redirect: false,
        }).then((err, res) => {   
            if (err) {
                setError(true);
                return
            }               
            localStorage.setItem('session',JSON.stringify({
                email: email
            }))
            router.push('/');
        }).catch(err => {
            console.log('error')
            setError(true);
        })                      
        .finally((res) => {
            setEmail();
            setPassword();
            setTimeout(() => {
                setError(false);
            }, 3000);
            setLoading(false)
        });
    }
  return (
    <Container>
        <Grid columns={16}>
            <Grid.Column computer={8} tablet={8} mobile={16} className="login-container">
                <Header>Iniciar Sesión</Header>
                {error && (
                    <Message
                        error
                        header='Ups...¡Algo a salido mal!'
                        content='Email o Contraseña incorrectos.'
                    />
                )}
                <Form>
               
                <Input className="margin-bottom-1" fluid placeholder="email" type="email" required value={email} onChange={ev => setEmail(ev.target.value)} />
                <Input className="margin-bottom-1" fluid placeholder="Contraseña" type="password" required value={password} onChange={ev => setPassword(ev.target.value)} />
                   
                </Form>
              
                <div className='signin'>
                <Button
                        loading={loading}
                        secondary
                        floated='right'
                        className="signin__btn signin__btn--email"
                        onClick={iniciarSesion}
                    >
                    <Icon as="i" name="mail" size="large" color="white" />
                    {t.loginemail}
                </Button>
                <div className='account-container'>
                    <p>
                        <strong>
                            {t.creacuenta}
                        </strong>
                    </p>
                    <p>¿Has olvidado tu contraseña?</p>
                </div>
                <Divider />
                    <Button className="signin__btn signin__btn--google" onClick={() => signIn('google', {
                    callback: BASE_URL
                    })}>
                        <Icon as="i" name="google" size="large" color="white" />{t.logingoogle}</Button>
                    <Button className="signin__btn signin__btn--facebook" onClick={() => signIn('facebook', {
                        callback: BASE_URL
                    })}>
                        <Icon as="i" name="facebook official" size="large" color="white" />{t.loginfacebook}</Button>
                </div>
                <Divider />
            </Grid.Column>
            <Grid.Column computer={8} tablet={8} mobile={16} className="login-container">
             <Header>Comprar como invitado</Header>
             <p>Puedes realizar la compra como invitado. Sólo introducirás los datos imprescindibles para poder hacer el pedido.
                Si quieres, podrás registrarte y guardar sus datos para próximas compras al final del proceso.</p>
                <Input fluid/>
                <Button className="mt-1" floated="right" primary>Comprar como invitado</Button>
            </Grid.Column>
        </Grid>
    </Container>
  )
}
