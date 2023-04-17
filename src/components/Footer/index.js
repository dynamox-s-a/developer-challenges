import {
  Box,
  Typography,
  InputBase,
  Snackbar,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "@component/components/Footer/Footer.module.css";

export default function Footer() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackBarMessage, setSnackbarMessage] = useState(false);

  useEffect(() => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const checkEmail = emailRegex.test(email);

    const phoneRegex = /^[0-9]{8,9}$/;
    const checkPhoneNumber = phoneRegex.test(phoneNumber);

    if (
      name.length < 3 ||
      company.length < 3 ||
      !checkEmail ||
      !checkPhoneNumber
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [name, company, email, phoneNumber]);

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const sendAlert = () => {
    const message = `Mensagem enviada!!\n 
    Nome: ${name} \n 
    Empresa: ${company} \n 
    Email: ${email} \n 
    Telefone: ${phoneNumber} \n`;

    setName("");
    setCompany("");
    setEmail("");
    setPhoneNumber("");
    setSnackbarMessage(message);
    handleSnackbarOpen();
  };

  return (
    <Box id="contato" className={styles.footerBox}>
      <Box className={styles.titleBoxContent}>
        <Typography variant="h6" component="h6">
          Ficou com dúvida?
        </Typography>
        <Typography variant="h6" component="h6">
          Nós entramos em contato com você
        </Typography>
      </Box>
      <Box className={styles.formBox}>
        <InputBase
          type="text"
          placeholder="Como gostaria de ser chamado?"
          value={name}
          onChange={({ target: { value } }) => setName(value)}
        />
        <InputBase
          type="text"
          placeholder="Em qual empresa você trabalha?"
          value={company}
          onChange={({ target: { value } }) => setCompany(value)}
        />
        <InputBase
          type="email"
          placeholder="Digite aqui o seu email"
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <InputBase
          type="tel"
          placeholder="Qual o seu telefone?"
          value={phoneNumber}
          onChange={({ target: { value } }) => setPhoneNumber(value)}
        />
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={10000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
            <Box>
              <AlertTitle>Success</AlertTitle>
            </Box>
            <Box>{snackBarMessage}</Box>
          </Alert>
        </Snackbar>
        <Button
          type="button"
          variant="contained"
          disabled={isDisabled}
          onClick={() => sendAlert()}
        >
          ENVIAR
        </Button>
      </Box>
    </Box>
  );
}
