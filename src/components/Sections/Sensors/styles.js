import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h1`
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 47px;
  text-align: center;
  color: #37383d;
  margin-top: 95px;
`;

export const Description = styled.p`
  font-family: "Raleway";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
  color: #454545;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 27px;
`;

export const ViewMoreButton = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;

  button {
    width: 183px;
    height: 39px;
    background: #263252;
    border-radius: 5px;
    color: #fff;
    border: none;
    cursor: pointer;
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 23px;
  }
`;

export const SensorsDescription = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
`;

export const Sensor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 45px;

  .sensor {
    width: 276.83px;
    height: auto;
    margin-left: 66px;
    margin-bottom: 14px;
  }

  p {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 47px;
    color: #5d7a8c;
    margin-left: 40px;
  }
`;
