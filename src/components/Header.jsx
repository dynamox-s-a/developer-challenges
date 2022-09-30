import React from "react";
import MediaQuery from "react-responsive";
import LogoDinamox from "../assets/images/logo-dynamox.png";
import { sizes } from "../styles/Devices";
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
        <MediaQuery minWidth={sizes.mobileM}>
          <p>teste device</p>
        </MediaQuery>
        <NavGroup>
          <NavDynaPredict href="https://dynamox.net/dynapredict/">DynaPredict</NavDynaPredict>
          <NavSensores href="#sensores">Sensores</NavSensores>
          <NavContato href="#contact">Contato</NavContato>
        </NavGroup>
      </BoxHeader>
    </Container>
  );
}
