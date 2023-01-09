/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable max-len */
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
  Alert,
  AlertTitle,
  Stack,
} from "@mui/material";
import "./contact.css";

interface ClientInfoInterface {
  name: string;
  company: string;
  email: string;
  phone: string;
}

export default function Contact(): JSX.Element {
  const [clientInfo, setClientInfo] = useState<ClientInfoInterface>({
    name: "",
    company: "",
    email: "",
    phone: "",
  } as ClientInfoInterface);

  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isAlert, setIsAlert] = useState<boolean>(false);

  const handleClientInfo = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    switch (event.target.name) {
      case "clientName":
        setClientInfo({ ...clientInfo, name: event.target.value });
        break;
      case "clientCompany":
        setClientInfo({ ...clientInfo, company: event.target.value });
        break;
      case "clientEmail":
        setClientInfo({ ...clientInfo, email: event.target.value });
        break;
      case "clientPhone":
        setClientInfo({ ...clientInfo, phone: event.target.value });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const verifyEmail = emailRegex.test(clientInfo.email);

    if (
      clientInfo.name.length < 3 ||
      clientInfo.company.length < 3 ||
      !verifyEmail ||
      clientInfo.phone.length < 8
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [clientInfo]);

  const handleClick = (): void => {
    setIsAlert(true);
    setTimeout(() => {
      setIsAlert(false);
      setClientInfo({
        name: "",
        company: "",
        email: "",
        phone: "",
      } as ClientInfoInterface);
    }, 5000);
  };

  return (
    <Box className="contactBox" id="contato">
      <Container className="containerBox">
        <Typography variant="h4" component="h2" gutterBottom>
          Ficou com dúvida?
        </Typography>
        <Typography variant="h4" component="h3" gutterBottom>
          Nós entramos em contato com você
        </Typography>

        <Box component="form" autoComplete="off" className="contactFormBox">
          <InputBase
            placeholder="Como gostaria de ser chamado?"
            type="text"
            className="contactInput"
            name="clientName"
            onChange={handleClientInfo}
            value={clientInfo.name}
          />
          <InputBase
            placeholder="Em qual empresa você trabalha?"
            type="text"
            className="contactInput"
            name="clientCompany"
            onChange={handleClientInfo}
            value={clientInfo.company}
          />
          <InputBase
            placeholder="Digite seu email"
            type="text"
            className="contactInput"
            name="clientEmail"
            onChange={handleClientInfo}
            value={clientInfo.email}
          />
          <InputBase
            placeholder="Qual o seu telefone?"
            type="text"
            className="contactInput"
            name="clientPhone"
            onChange={handleClientInfo}
            value={clientInfo.phone}
          />
        </Box>

        <Button
          variant="contained"
          color="secondary"
          className="formButton"
          onClick={handleClick}
          disabled={isDisabled}
          style={{ opacity: isDisabled ? 0.8 : 1 }}
        >
          Enviar
        </Button>
      </Container>
      {isAlert && (
        <Stack className="alertInfo">
          <Alert severity="info">
            <AlertTitle>Entraremos em contato assim que possível!</AlertTitle>
            {`Olá ${clientInfo.name}, entraremos em contato com você em breve! Através do email ${clientInfo.email} ou pelo telefone ${clientInfo.phone}.`}
          </Alert>
        </Stack>
      )}
    </Box>
  );
}
