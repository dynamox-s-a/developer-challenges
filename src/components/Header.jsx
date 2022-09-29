import React from "react";
import LogoDinamox from "../assets/images/logo-dynamox.png";
import {
  NavContato,
  NavDynaPredict,
  NavGroup,
  NavSensores,
  Container,
  ImageLogo,
  NavLogo,
  BoxHeader,
} from "../styles/components/Header";

export default function Header() {
  return (
    <Container>
      <BoxHeader>
        <NavLogo href="https://dynamox.net/">
          <ImageLogo src={LogoDinamox} alt="logo-dynamox.png" />
        </NavLogo>
        <NavGroup>
          <NavDynaPredict href="https://dynamox.net/dynapredict/">DynaPredict</NavDynaPredict>
          <NavSensores href="#sensores">Sensores</NavSensores>
          <NavContato href="#contact">Contato</NavContato>
        </NavGroup>
      </BoxHeader>
    </Container>
  );
}
