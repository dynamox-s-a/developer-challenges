import styled from "styled-components";
import Grafismo from "../../assets/images/grafismo.png";

export const DinaPredictContainer = styled.section`
  background: #263252;
  height: 1280px;
  width: 100%;
`;

export const Stack = styled.div`
  align-items: center;
  background-image: url(${Grafismo});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  margin: 0 auto;
  max-width: 80rem;
  overflow: hidden;
  width: 100%;
`;

export const BoxDynaPredict = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 39rem;
  max-width: 36.5rem;
  padding: 5rem 1rem 0 5rem;
  width: 40%;
`;

export const BoxDesktopAndMobile = styled.div`
  max-height: 39rem;
  max-width: 43.25rem;
`;

export const TitleDinaPredict = styled.h1`
  color: #ffffff;
  font-family: "Raleway", sans-serif;
  font-size: 3rem;
  font-weight: 700;
  line-height: 3rem;
  margin: 1rem 0;
  text-align: start;
  word-break: break-word;
`;

export const ImageLogoDynaPredict = styled.img`
  max-height: 1.94rem;
  max-width: 10rem;
`;

export const ImageDesktopAndMobile = styled.img`
  height: 100%;
  width: 100%;
`;
