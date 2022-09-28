import { useState } from 'react';
import { Modal } from '../Modal';

import './styles.css';

export function Contact() {
  const [form, setForm] = useState({
    nome: '',
    company: '',
    email: '',
    phone: ''
  });

  function handleForm() {
    const preenchidos = Object.keys(form).filter((key) => {
      return form[key] !== '';
    })
    
    if(preenchidos.length === 4) {
      document.querySelector('.modal-overlay').classList.add('active');
    } else {
      alert('Preencha todos os campos para entrarmos em contato com você');
    }
  }

  return(
    <section className="grid-pattern contact" id="contact">
      <div className="contact-section">

        <div className="contact-content">
          <h3 className="title">
            Ficou com dúvida? <br /> 
            Nós entramos em contato com você
          </h3>

          <div className="contact-form">
            <label htmlFor="nome">Nome:</label>
            <input 
              id="nome"
              type="text" 
              placeholder="Como gostaria de ser chamado?"
              value={form.name} 
              onChange={e => setForm(prevent => {
                return {...prevent, nome: e.target.value}
              })} 
            />

            <label htmlFor="company">Empresa:</label>
            <input 
              id="company"
              type="text" 
              placeholder="Em qual empresa você trabalha?"
              value={form.company} 
              onChange={e => setForm(prevent => {
                return {...prevent, company: e.target.value}
              })} 
            />

            <label htmlFor="email">Email:</label>
            <input 
              id="email"
              type="email" 
              placeholder="Digite aqui o seu email"
              value={form.email} 
              onChange={e => setForm(prevent => {
                return {...prevent, email: e.target.value}
              })} 
             />

            <label htmlFor="phone">Telefone:</label>
            <input 
              id="phone"
              type="text" 
              placeholder="Qual o seu telefone?" 
              value={form.phone} 
              onChange={e => setForm(prevent => {
                return {...prevent, phone: e.target.value}
              })} 
            />
            <button onClick={handleForm}>Enviar</button>
          </div>
        </div>
        
        <Modal form={form} />
    
      </div>
    </section>
  )
}