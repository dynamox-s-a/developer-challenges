import React, { useState } from 'react';
import Input from '../Input/Input';

export default function Contact() {

    const [name, setName] = useState('')
    const [company, setCompany] = useState('')
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')

    const enviarDados = (evento) => {
        evento.preventDefault()
        const data = {
            name,
            company,
            email,
            tel
        }
        alert(`
        Confirme os seus dados
        Nome: ${data.name}
        Empresa: ${data.company}
        Email: ${data.email}
        Telefone: ${data.tel}
        `)

        window.location.reload()
    }
    
  return (
    <section id="contato"
    className="bg-dyna-blue p-12 flex flex-col items-center text-center">
        <h2 className='text-3xl font-bold text-white'>Ficou com dúvida?<br/>Nós entramos em contato com você</h2>
        <form onSubmit={enviarDados} className='flex w-full flex-col m-8 gap-3 items-center'>
            
            {/* Componente Input renderizando a tag input com seus atributos */}
            <Input type='text' name="name" id="name" placeholder="Como gostaria de ser chamado?" setData={setName} />

            <Input type='text' name="company" id="company" placeholder="Em qual empresa você tabalha?" setData={setCompany} />

            <Input type='email' name="email" id="email" placeholder="Digite aqui o seu email" setData={setEmail} />

            <Input type='tel' name="tel" id="tel" placeholder="Qual o seu telefone?" setData={setTel} />

            <button type='submit' className="p-1 w-44 rounded-lg bg-[#0165DB] text-white text-xl font-bold uppercase mt-6">Enviar</button>
        </form>
    </section>
  )
}
