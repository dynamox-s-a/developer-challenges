import styled from "styled-components";

export const SensoresContainer = styled.section`
  background: #f4f7fc;
  min-height: 51.25rem;
  width: 100%;
  @media screen and (max-width: 768px) {
    min-height: 50rem;
  }
`;

export const SensoresBox = styled.section`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 80rem;
  padding: 2.5rem 0;
  width: 100%;
  @media screen and (max-width: 768px) {
    max-width: 100%;
    max-height: 100%;
    padding: 1rem 0;
  }
`;

export const SensoresTitle = styled.h1`
  color: #37383d;
  font-family: "Raleway", sans-serif;
  font-size: 2.5em;
  font-style: normal;
  font-weight: 700;
  height: 3.375rem;
  line-height: 3rem;
  margin-top: 3rem;
  text-align: center;
  word-break: break-word;
  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
    line-height: normal;
    margin-bottom: 0.5rem;
  }
`;

export const SensoresText = styled.p`
  align-items: center;
  color: #454545;
  font-family: "Raleway", sans-serif;
  font-size: 1.5em;
  font-style: normal;
  font-weight: 400;
  line-height: 1.75rem;
  margin: 1rem 0;
  padding: 0 3rem;
  text-align: center;
  word-break: break-word;
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    font-weight: 200;
    line-height: normal;
    padding: 0 1rem;
  }
`;

export const SensoresButton = styled.a`
  align-items: center;
  background: #263252;
  border-radius: 0.3rem;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  font-family: "Raleway", sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  height: 2.5rem;
  justify-content: center;
  margin: 1rem 0;
  text-align: center;
  text-decoration: none;
  width: 11.5rem;
  @media screen and (max-width: 768px) {
    font-size: 1rem;
    font-weight: 600;
    width: 7.5rem;
    margin: 2rem;
  }
`;

export const SensoresGroup = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

export const Sensor = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1rem;
  @media screen and (max-width: 768px) {
    height: 7.5rem;
    width: 100%;
    padding: 3rem 0;
  }
`;

export const SensorImage = styled.img`
  max-height: 18.615rem;
  max-width: 17.3rem;
  @media screen and (max-width: 768px) {
    width: 100%;
  }
  @media screen and (max-width: 1024px) {
    height: 10rem;
    width: 100%;
  }
`;

export const SensorName = styled.h2`
  color: #5d7a8c;
  font-family: "Raleway", sans-serif;
  font-size: 2.5em;
  font-style: normal;
  font-weight: 700;
  height: 3.7rem;
  line-height: 3rem;
  margin-bottom: 1rem;
  margin: 0 auto;
  text-align: center;
  word-break: break-word;
  @media screen and (max-width: 768px) {
    font-size: 1.5rem;
  }
`;
