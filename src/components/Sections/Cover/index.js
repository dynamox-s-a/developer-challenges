import * as React from "react";
import Image from "next/image";
import { Container, Title } from "./styles";
import desktopAndMobile from "@/assets/images/desktop-and-mobile.png";
import logoDynapredict from "@/assets/images/logo-dynapredict.png";

export default function Cover() {
  return (
    <Container>
      <Title>
        <h1>Solução DynaPredict</h1>
        <Image
          src={logoDynapredict}
          alt="logoDynapredict"
          className="logoDynapredict"
        />
      </Title>
      <Image
        src={desktopAndMobile}
        alt="desktopAndMobile"
        className="desktopAndMobile"
      />
    </Container>
  );
}
