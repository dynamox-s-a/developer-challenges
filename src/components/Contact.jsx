import React, { useState } from "react";
import {
  BoxContactTitle,
  ContactContainer,
  ContactForms,
  ContactTitle,
  FormsButton,
  FormsInput,
} from "../styles/components/Contact";

export default function Contact() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const submitContact = () => {
    global.alert(
      `Agradecemos seu contato!\n
      Nome: ${name}\n
      Empresa: ${company}\n
      Email: ${email}\n
      Telefone: ${phone}\n`,
    );
  };

  return (
    <ContactContainer id="contact">
      <BoxContactTitle>
        <ContactTitle>Ficou com dúvida?</ContactTitle>
        <ContactTitle>Nós entramos em contato com você</ContactTitle>
      </BoxContactTitle>
      <ContactForms action="">
        <FormsInput
          type="text"
          placeholder="Como gostaria de ser chamado?"
          onChange={({ target }) => setName(target.value)}
        />
        <FormsInput
          type="text"
          placeholder="Em qual empresa você trabalha?"
          onChange={({ target }) => setCompany(target.value)}
        />
        <FormsInput
          type="email"
          placeholder="Digite aqui o seu email"
          onChange={({ target }) => setEmail(target.value)}
        />
        <FormsInput
          type="text"
          placeholder="Qual o seu telefone"
          onChange={({ target }) => setPhone(target.value)}
        />
        <FormsButton type="button" onClick={() => submitContact()}>
          ENVIAR
        </FormsButton>
      </ContactForms>
    </ContactContainer>
  );
}
