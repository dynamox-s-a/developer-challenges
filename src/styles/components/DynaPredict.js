import styled from "styled-components";
import Grafismo from "../../assets/images/grafismo.png";

export const DinaPredictContainer = styled.section`
  max-height: 45rem;
  width: 100%;
  height: 100%;
  background: #263252;
`;

export const Stack = styled.div`
  height: 100%;
  width: 100%;
  align-items: flex-start;
  background-image: url(${Grafismo});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: center;
  max-width: 80rem;
  overflow: hidden;
  width: 100%;
  margin: 0 auto;
`;

export const BoxDynaPredict = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  width: 40%;
  max-height: 39rem;
  max-width: 36.5rem;
  padding: 5rem 1rem 0 5rem;
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
  word-break: break-word;
  text-align: start;
  margin: 1rem 0;
`;

export const ImageLogoDynaPredict = styled.img`
  max-width: 10rem;
  max-height: 1.94rem;
`;

export const ImageDesktopAndMobile = styled.img`
  height: 100%;
  width: 100%;
`;
