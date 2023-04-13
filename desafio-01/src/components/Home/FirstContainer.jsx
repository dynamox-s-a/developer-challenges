import React from "react";
import styles from '@/styles/FirstContainer.module.css';
import { Container, Grid } from "@mui/material";

export const FirstContainer = () => {
  return (
    <div className={styles['fisrt-container']}>
      <Container maxWidth="lg">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} md={5}>
            <div className={styles['first-container-txt']}>
              <h1>Solução DynaPredict</h1>
              <img src="/assets/logo-dynapredict.png" alt="" />
            </div>
          </Grid>
          <Grid item xs={12} md={7}>
            <div className={styles['first-container-img']}>
              <img src="/assets/desktop-and-mobile.png" alt="" />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
