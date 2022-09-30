import React from "react";
import {
  BoxContactTitle,
  ContactContainer,
  ContactForms,
  ContactTitle,
  FormsButton,
  FormsInput,
} from "../styles/components/Contact";

export default function Contact() {
  return (
    <ContactContainer id="contact">
      <BoxContactTitle>
        <ContactTitle>Ficou com dúvida?</ContactTitle>
        <ContactTitle>Nós entramos em contato com você</ContactTitle>
      </BoxContactTitle>
      <ContactForms action="">
        <FormsInput type="text" placeholder="Como gostaria de ser chamado?" />
        <FormsInput type="text" placeholder="Em qual empresa você trabalha?" />
        <FormsInput type="email" placeholder="Digite aqui o seu email" />
        <FormsInput type="text" placeholder="Qual o seu email" />
        <FormsButton type="submit" onClick="">
          ENVIAR
        </FormsButton>
      </ContactForms>
    </ContactContainer>
  );
}
