import React, { useState } from 'react';

function Footer() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const sendAlert = () => {
    alert(`Nome: ${name} \n Empresa: ${company} \n Email: ${email} \n Telefone: ${phoneNumber} \n`);
  };

  return (
    <footer id="footer-section">
      <h3>Ficou com dúvida?</h3>
      <h3>Nós entramos em contato com você</h3>
      <form>
        <input
          type="text"
          name="nome"
          placeholder="Como gostaria de ser chamado?"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
        <input
          type="text"
          name="company"
          placeholder="Em qual empresa você trabalha?"
          value={company}
          onChange={({ target: { value } }) => setCompany(value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Digite aqui o seu email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Qual o seu telefone?"
          value={phoneNumber}
          onChange={({ target: { value } }) => setPhoneNumber(value)}
        />
        <button type="submit" onClick={() => sendAlert()}>ENVIAR</button>
      </form>

    </footer>
  );
}

export default Footer;
