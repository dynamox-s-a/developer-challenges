import React from "react";
import LogoDinamox from "../assets/logo-dynamox.png";
import {
  NavContato,
  NavDynaPredict,
  NavGroup,
  NavSensores,
  Container,
  ImageLogo,
  NavLogo,
} from "../styles/components/Header";

export default function Header() {
  return (
    <Container>
      <NavLogo href="https://dynamox.net/">
        <ImageLogo src={LogoDinamox} alt="logo-dynamox.png" />
      </NavLogo>
      <NavGroup>
        <NavDynaPredict href="https://dynamox.net/dynapredict/">DynaPredict</NavDynaPredict>
        <NavSensores href="https://dynamox.net/">Sensores</NavSensores>
        <NavContato href="https://dynamox.net/">Contato</NavContato>
      </NavGroup>
    </Container>
  );
}
