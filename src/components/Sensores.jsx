import React from "react";
import SensorAf from "../assets/images/sensor-af.png";
import SensorHf from "../assets/images/sensor-hf.png";
import SensorTca from "../assets/images/sensor-tca.png";
import {
  Sensor,
  SensoresBox,
  SensoresButton,
  SensoresContainer,
  SensoresGroup,
  SensoresText,
  SensoresTitle,
  SensorImage,
  SensorName,
} from "../styles/components/Sensores";

export default function Sensores() {
  return (
    <SensoresContainer id="sensores">
      <SensoresBox>
        <SensoresTitle>Sensores para Manutenção Preditiva</SensoresTitle>
        <SensoresText>
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração triaxial e temperatura
          embarcados, que comunicam por Bluetooth com o App mobile ou Gateway, registrando os dados
          monitorados em sua memória interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de decisão.
        </SensoresText>
        <SensoresButton href="https://dynamox.net/dynapredict/">VER MAIS</SensoresButton>
      </SensoresBox>
      <SensoresGroup>
        <Sensor>
          <SensorImage src={SensorTca} alt="sensor-tca.png" />
          <SensorName>TcA+</SensorName>
        </Sensor>
        <Sensor>
          <SensorImage src={SensorAf} alt="sensor-af.png" />
          <SensorName>AS</SensorName>
        </Sensor>
        <Sensor>
          <SensorImage src={SensorHf} alt="sensor-hf.png" />
          <SensorName>HF</SensorName>
        </Sensor>
      </SensoresGroup>
    </SensoresContainer>
  );
}
