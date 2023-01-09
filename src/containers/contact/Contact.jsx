import React from 'react';
import './contact.css';

const Contact = () => {
  return (
    <div className="contact" id="Contato">
      <div className="contact-text">
        <h3>Ficou com dúvida?<br></br>Nós entramos em contato com você</h3>
      </div>
      <div className="contact-inputs">
        <input type="text" placeholder="Como gostaria de ser chamado?" />
        <input type="text" placeholder="Em qual empresa você trabalha?" />
        <input type="email" placeholder="Digite aqui o seu email" />
        <input type="number" placeholder="Qual o seu telefone?" />
      </div>
      <div className="contact-btn">
        <p>ENVIAR</p>
      </div>
    </div>
  )
}

export default Contact