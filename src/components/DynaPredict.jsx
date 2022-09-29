import React from "react";
import LogoDynaPredict from "../assets/images/logo-dynapredict.png";
import DesktopAndMobile from "../assets/images/desktop-and-mobile.png";
import {
  BoxDesktopAndMobile,
  BoxDynaPredict,
  DinaPredictContainer,
  ImageDesktopAndMobile,
  ImageLogoDynaPredict,
  Stack,
  TitleDinaPredict,
} from "../styles/components/DynaPredict";

export default function DynaPredict() {
  return (
    <DinaPredictContainer>
      <Stack>
        <BoxDynaPredict>
          <TitleDinaPredict>Solução DynaPredict</TitleDinaPredict>
          <ImageLogoDynaPredict src={LogoDynaPredict} alt="logo-dynapredict.png" />
        </BoxDynaPredict>
        <BoxDesktopAndMobile>
          <ImageDesktopAndMobile src={DesktopAndMobile} alt="desktop-and-mobile.png" />
        </BoxDesktopAndMobile>
      </Stack>
    </DinaPredictContainer>
  );
}
