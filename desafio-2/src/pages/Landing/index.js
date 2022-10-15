import React from "react";
import {
  LandingContanier,
  Contanier,
  Logo,
  BTNContanier,
  LoginLink,
  Link,
  Title,
} from "./styles";
import { Linkbtn } from "../../components/Link";
import logo from "../../assets/Logo.png";

export const LandingPage = () => {
  return (
    <LandingContanier>
      <Contanier>
        <Logo src={logo}></Logo>
      </Contanier>
      <BTNContanier>
        <LoginLink>
          <Linkbtn href="/register" title="login/signup"></Linkbtn>
        </LoginLink>
      </BTNContanier>
    </LandingContanier>
  );
};
