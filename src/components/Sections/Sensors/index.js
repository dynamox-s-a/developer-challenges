import * as React from "react";
import { forwardRef } from "react";
import Image from "next/image";
import {
  Container,
  Title,
  Description,
  ViewMoreButton,
  SensorsDescription,
  Sensor,
} from "./styles";
import sensorTCA from "@/assets/images/sensor-tca.png";
import sensorAS from "@/assets/images/sensor-as.png";
import sensorHF from "@/assets/images/sensor-hf.png";
import Button from "@/components/Button/Button";

export function Sensors(props, sensorsRef) {
  const sensors = [
    {
      name: "TcA+",
      image: sensorTCA,
    },
    {
      name: "AS",
      image: sensorAS,
    },
    {
      name: "HF",
      image: sensorHF,
    },
  ];
  return (
    <Container ref={sensorsRef}>
      <Title >Sensores para Manutenção Preditiva</Title>
      <Description>
        Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
        triaxial <br></br>e temperatura embarcados, que comunicam por Bluetooth
        com o App mobile ou Gateway,<br></br> registrando os dados monitorados
        em sua memória interna. Por conexão internet esses dados <br></br> são
        centralizados na Plataforma DynaPredict Web para análise, prognóstico e
        tomada de decisão.
      </Description>
      <ViewMoreButton>
        <Button
          color="secondary"
          onClick={() => {
            window.location.href = "https://dynamox.net/dynapredict/";
          }}
        >
          VER MAIS
        </Button>
      </ViewMoreButton>
      <SensorsDescription>
        {sensors.map((sensor, index) => {
          return (
            <Sensor key={index}>
              <Image src={sensor.image} alt={sensor.name} className="sensor" />
              <p>{sensor.name}</p>
            </Sensor>
          );
        })}
      </SensorsDescription>
    </Container>
  );
}

export default forwardRef(Sensors);
