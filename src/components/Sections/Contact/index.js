import { forwardRef } from "react";
import { Container, Title } from "./styles";
import Form from "@/components/Form/Form";

export function Contact(props, contactRef) {
  return (
    <Container>
      <Title ref={contactRef}>
        Ficou com dúvida? <br></br> Nós entramos em contato com você
      </Title>
      <Form />
    </Container>
  );
}

export default forwardRef(Contact);
