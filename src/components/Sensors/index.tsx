import { Container, Title, Text, Button, TypeSensors } from "./styles";
import imageTCA from "../../assets/tca.svg";
import imageAS from "../../assets/as.svg";
import imageHF from "../../assets/hf.svg";
import { NavLink } from "react-router-dom";

export function Sensors() {
  return (
    <Container id="sensores">
      <Title>Sensores para Manutenção Preditiva</Title>
      <Text>
        Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
        triaxial e temperatura embarcados, que comunicam por Bluetooth com o App
        mobile ou Gateway, registrando os dados monitorados em sua memória
        interna. Por conexão internet esses dados são centralizados na
        Plataforma DynaPredict Web para análise, prognóstico e tomada de
        decisão.
      </Text>
      <NavLink to="/data">
        <Button>VER MAIS</Button>
      </NavLink>
      <TypeSensors>
        <img src={imageTCA} alt="Imagem Ilustrativa do Sensor TcA+" />
        <img src={imageAS} alt="Imagem Ilustrativa do Sensor AS" />
        <img src={imageHF} alt="Imagem Ilustrativa do Sensor HF" />
      </TypeSensors>
    </Container>
  );
}
