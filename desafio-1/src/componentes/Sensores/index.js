import {
  SensoresContainer,
  InfoContainer,
  Title,
  SensoresDesc,
  ImageContanier,
  SensorImage,
  Sensor,
  SensorName,
} from "./sensoresElements";
import sensores from "../../assets/sensores";

export function Sensores() {
  return (
    <SensoresContainer id="Sensores">
      <InfoContainer>
        <Title>Sensores para Manutenção Preditiva</Title>
        <SensoresDesc>
          Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
          triaxial e temperatura embarcados, que comunicam por Bluetooth com o
          App mobile ou Gateway, registrando os dados monitorados em sua memória
          interna. Por conexão internet esses dados são centralizados na
          Plataforma DynaPredict Web para análise, prognóstico e tomada de
          decisão.
        </SensoresDesc>
        <ImageContanier>
          {sensores.map((sensor) => {
            return (
              <Sensor key={sensor.id}>
                <SensorImage src={sensor.image.img} alt={sensor.name} />
                <SensorName>{sensor.name}</SensorName>
              </Sensor>
            );
          })}
        </ImageContanier>
      </InfoContainer>
    </SensoresContainer>
  );
}
