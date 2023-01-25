import * as React from "react";
import { Container, Title } from "./styles";

import Form from "@/components/Form/Form";

export default function Cover() {
  return (
    <Container>
      <Title>
        Ficou com dúvida? <br></br> Nós entramos em contato com você
      </Title>
      <Form />
      
    </Container>
  );
}
