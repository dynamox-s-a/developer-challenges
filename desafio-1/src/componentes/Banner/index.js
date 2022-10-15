import {
  BannerContainer,
  BGImage,
  BannerBg,
  InfoContanier,
  Texto,
  Logo,
  ApresentaçãoContanier,
  ImagemComputador,
} from "./styles";
import background from "../../assets/grafismo.svg";
import computador from "../../assets/desktop-and-mobile.svg";

import logo from "../../assets/logo-dynapredict.svg";
export function Banner() {
  return (
    <BannerContainer>
      <BannerBg>
        <BGImage src={background}></BGImage>
      </BannerBg>

      <InfoContanier>
        <ApresentaçãoContanier>
          <Texto>Solução DynaPredict</Texto>
          <Logo src={logo} />
        </ApresentaçãoContanier>
        <ImagemComputador src={computador} />
      </InfoContanier>
    </BannerContainer>
  );
}
