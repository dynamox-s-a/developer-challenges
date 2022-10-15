import styled from "styled-components";

export const SensoresContainer = styled.div`
  display: grid;
  justify-content: center;
  height: 100vh;

  @media screen and (max-width: 1061px) {
    height: 1800px;
  }
`;

export const InfoContainer = styled.article`
  width: 1100px;
  margin-top: 120px;
  @media screen and (max-width: 1061px) {
    width: 800px;
  }
`;

export const Title = styled.h1`
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 47px;
  text-align: center;

  color: #37383d;
`;
export const SensoresDesc = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  align-items: center;
  text-align: center;

  color: #454545;
  @media screen and (max-width: 1061px) {
    font-size: 18px;
  }
`;
export const Sensor = styled.div`
  width: 278px;
  height: 371px;
  margin: 67px;
`;
export const ImageContanier = styled.div`
  display: flex;
  margin: auto;
  margin-left: -50px;
  width: 1200px;
  height: 400px;
  justify-content: center;
  align-content: space-between;
  @media screen and (max-width: 1061px) {
    width: 800px;
    margin-left: 0;
    display: grid;
    justify-content: center;
  }
`;
export const SensorImage = styled.img``;

export const SensorName = styled.h3`
  font-style: normal;
  color: #5d7a8c;
  font-weight: 700;
  font-size: 40px;
  line-height: 47px;
  text-align: center;
`;
