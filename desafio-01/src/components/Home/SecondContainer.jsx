import React from "react";
import styles from '@/styles/SecondContainer.module.css';
import { Button } from "../Button";
import { Container, Grid } from "@mui/material";
import { Sensor } from "../Sensor/Sensor";

export const SecondContainer = () => {
  return (
    <div id="sensores" className={styles['second-container']}>
      <Container maxWidth="lg">
        <Grid container>
          <Grid item xs={12}>
            <div className={styles['second-container-txt']}>
              <h2>Sensores para Manutenção Preditiva</h2>
              <p>Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e
                temperatura embarcados, que comunicam por Bluetooth com o App mobile ou Gateway,
                registrando os dados monitorados em sua memória interna. Por conexão internet esses dados
                são centralizados na Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.</p>
              <a href="https://dynamox.net/dynapredict/" target="_blank">
                <Button color="dark">VER MAIS</Button>
              </a>

            </div>
          </Grid>
          <Grid item container xs={12} justifyContent="center">
            <Grid item xs={12} lg={4}>
              <Sensor img="/assets/sensor-tca.png" text="TcA+" />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Sensor img="/assets/sensor-af.png" text="AS" />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Sensor img="/assets/sensor-hf.png" text="HF" />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}