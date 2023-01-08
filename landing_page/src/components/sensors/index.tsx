import React from "react";
import { Box, Button, Typography } from "@mui/material";
import "./Sensors.css";
import { sensorImages } from "./helper";

export default function Sensors(): JSX.Element {
  return (
    <Box className="sensorsBox" id="sensores">
      <Box className="sensorsInfoBox">
        <Typography variant="h3" component="h2" gutterBottom>
          Sensores para Manutenção preditiva
        </Typography>

        <Typography variant="h5" component="p" gutterBottom>
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </Typography>

        <Typography
          variant="h6"
          component="a"
          href="https://dynamox.net/dynapredict/"
          target="_blank"
        >
          <Button variant="contained">Ver Mais</Button>
        </Typography>
      </Box>

      <Box className="sensorImagesBox">
        {sensorImages.map((sensor) => (
          <Box className="sensorImage">
            <img src={sensor.url} alt={sensor.name} />
            <Typography variant="h3" component="h3">
              {sensor.name}
            </Typography>
          </Box>
        ))}

      </Box>
    </Box>
  );
}
