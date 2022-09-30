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
    <footer id="footer-section" className='py-10 font-raleway bg-primary-blue h-footer-heigth w-full'>
      <div className=' flex flex-col items-center text-white text-secondary-font-size font-bold'>
        <h3>Ficou com dúvida?</h3>
        <h3>Nós entramos em contato com você</h3>
      </div>
      <form className='flex flex-col items-center gap-3 mt-5 text-text-sensors'>
        <input
          className='w-input-width px-8 py-2 text-center rounded outline-none placeholder:text-text-sensors'
          type="text"
          name="nome"
          placeholder="Como gostaria de ser chamado?"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
        <input
          className='w-input-width px-8 py-2 text-center rounded outline-none placeholder:text-text-sensors'
          type="text"
          name="company"
          placeholder="Em qual empresa você trabalha?"
          value={company}
          onChange={({ target: { value } }) => setCompany(value)}
        />
        <input
          className='w-input-width px-8 py-2 text-center rounded outline-none placeholder:text-text-sensors'
          type="email"
          name="email"
          placeholder="Digite aqui o seu email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <input
          className='w-input-width px-8 py-2 text-center rounded outline-none placeholder:text-text-sensors'
          type="tel"
          name="phone"
          placeholder="Qual o seu telefone?"
          value={phoneNumber}
          onChange={({ target: { value } }) => setPhoneNumber(value)}
        />
        <button 
        className='mt-4 p-2 w-button-width bg-button-sent text-white font-bold text-xl rounded'
        type="submit" 
        onClick={() => sendAlert()}>ENVIAR</button>
      </form>

    </footer>
  );
}

export default Footer;
