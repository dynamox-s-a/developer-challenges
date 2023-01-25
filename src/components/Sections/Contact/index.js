import * as React from "react";
import { Container, Title, Row, TitleForm, Label } from "./styles";
import Button from "@/components/Button/Button";
import { useState, useContext } from "react";

export default function Cover() {
  return (
    <Container>
      <Title>
        Ficou com dúvida? <br></br> Nós entramos em contato com você
      </Title>

      <Button type="submit" color="primary">
        Enviar
      </Button>
    </Container>
  );
}
