import { Container, Grid } from "@mui/material";
import React from "react";
import styles from '@/styles/Header.module.css';

export const Header = () => {
  return (
    <div className={styles.header}>
      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="space-between" alignItems="flex-end" className={styles['header-container']}>
          <Grid item>
            <div className={styles['header-logo']}>
              <a href="https://dynamox.net/" target="_blank">
                <img src="/assets/logo-dynamox.png" alt="Dynamox logo" />
              </a>
            </div>
          </Grid>
          <Grid item>
            <div className={styles['header-options']}>
              <a href="https://dynamox.net/dynapredict/" target="_blank">DynaPredict</a>
              <a href="#sensores">Sensores</a>
              <a href="#contato">Contato</a>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}