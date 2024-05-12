import { Container, Content, ContainerText, Title } from "./styles";
import LogoDinaPredict from "../../assets/logo-dynapredict.svg";
import IlustrationImage from "../../assets/image-notebook.svg";

export function Solution() {
  return (
    <Container id="dynapredict">
      <Content>
        <ContainerText>
          <Title>Solução DynaPredict</Title>
          <img src={LogoDinaPredict} alt="Logo DynaPredict" />
        </ContainerText>

        <img
          src={IlustrationImage}
          alt="Imagem Ilustrativa do Sistema"
          className="image-notebook"
        />
      </Content>
    </Container>
  );
}
