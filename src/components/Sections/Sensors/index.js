import * as React from "react";
import Image from "next/image";
import { Container, Title, Description, ViewMoreButton } from "./styles";

export default function Cover() {
  return (
    <Container>
      <Title>Sensores para Manutenção Preditiva</Title>
      <Description>
        Opções de sensores sem fio, ou DynaLoggers com sensores de vibração
        triaxial <br></br>e temperatura embarcados, que comunicam por Bluetooth
        com o App mobile ou Gateway,<br></br> registrando os dados monitorados
        em sua memória interna. Por conexão internet esses dados <br></br> são
        centralizados na Plataforma DynaPredict Web para análise, prognóstico e
        tomada de decisão.
      </Description>
      {/* <ViewMoreButton
        onClick={() => {
          window.location.href = "https://dynamox.net/dynapredict/";
        }}
      >
        VER MAIS
      </ViewMoreButton> */}
      {/* <Image
        src={desktopAndMobile}
        alt="desktopAndMobile"
        className="desktopAndMobile"
      /> */}
    </Container>
  );
}
