import React , { useEffect, useState } from 'react'
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import StepTree from './components/StepTree';
import Steps from "./components/steps";
import StepFour from './components/StepFour';
import { session, signIn, signOut, useSession } from "next-auth/react"
import { STEPS_SHOPPING } from './constants';

export default function ShopppingCart() {
  const { data: session } = useSession();
  const [steps,setSteps] = useState(STEPS_SHOPPING);
  const [active,setActive] = useState('Registro')

  useEffect(() => {
    if(!session) return;
    setActive('Opciones de envío');
  },[session]);
  
  return (
    <section className='steps-container'>
        <Steps active={active} setActive={setActive} />
        { active === 'Registro' 
            && (<StepOne />)}
        { active === 'Opciones de envío' 
            && (<StepTwo setActive={setActive}/>)}
        { active === 'Pago' 
            && (<StepTree setActive={setActive}/>)}
        { active === 'Resumen' 
            && (<StepFour setActive={setActive}/>)}
        
    </section>
  )
}
