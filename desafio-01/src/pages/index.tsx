import Header from '@/componentes/Header'
import React from 'react';
import DynaPredict from '@/componentes/DynaPredict';
import Senores from '@/componentes/Sensores';
import Contact from '@/componentes/Contato';
import Page from '@/componentes/Page';


export default function Home() {
  return (
    <>
      <Page title="Solução DynaPredict" description="Sensores e soluções tecnologicas da dynamox" path="/"/>
      <main>
        <Header/>
        <DynaPredict/>
        <Senores />
        <Contact />
      </main>
    </>
  )
}
