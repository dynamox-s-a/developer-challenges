import React, { useState } from "react";
import styles from '@/styles/LastContainer.module.css';
import { Button } from "../Button";
import { Container, Grid } from "@mui/material";
import { Input } from "../Input";

export const LastContainer = () => {

  const sendInfo = (e) => {
    e.preventDefault();
    alert(`Nome: ` + name + ` Empresa: ` + company + ` email: ` + email + ` tel ` + tel);
  }

  const [name, setName] = useState("");

  const [company, setCompany] = useState("");

  const [email, setEmail] = useState("");

  const [tel, setTel] = useState("");

  return (
    <div id="contato" className={styles['last-container']}>
      <Container maxWidth="lg">
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <div className={styles['last-container-txt']}>
              <h2>Ficou com dúvida?<br />Nós entramos em contato com você</h2>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={styles['last-container-form']}>
              <form onSubmit={sendInfo}>
                <div className={styles.form}>
                  <Input
                    placeholder="Como gostaria de ser chamado?"
                    onChange={setName}
                  />
                  <Input
                    placeholder="Em qual empresa você trabalha?"
                    onChange={setCompany}
                  />
                  <Input
                    type="email"
                    placeholder="Digite aqui o seu email"
                    onChange={setEmail}
                  />
                  <Input
                    type="tel"
                    placeholder="Qual o seu telefone?"
                    onChange={setTel}
                  />
                </div>
                <div className={styles['button-container']}>
                  <Button>ENVIAR</Button>
                </div>
              </form>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>

  );
}