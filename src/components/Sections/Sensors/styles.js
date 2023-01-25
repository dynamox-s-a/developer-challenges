import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h2`
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 47px;
  text-align: center;
  color: #37383d;
  margin-top: 95px;

  @media (min-width: 768px) and (max-width: 1300px) {
    font-size: 30px;
    line-height: 27px;
    margin-top: 55px;
  }
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

  @media (min-width: 768px) and (max-width: 1300px) {
    font-size: 20px;
    line-height: 18px;
    margin-top: 10px;
    margin-bottom: 10px;
    word-wrap: wrap;
    padding:20px;
  }
`;

export const ViewMoreButton = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;

  @media (min-width: 768px) and (max-width: 1300px) {
    margin-bottom: 25px;
  }
`;

export const SensorsDescription = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 45px;
  @media (min-width: 768px) and (max-width: 1300px) {
  }
`;

export const Sensor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 45px;

  .sensor {
    width: 276.83px;
    height: auto;
    margin-bottom: 14px;
  }

  &:nth-child(2),
  &:nth-child(3) {
    margin-left: 66px;
  }

  p {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 47px;
    color: #5d7a8c;
  }

  @media (min-width: 768px) and (max-width: 1300px) {
    margin-bottom: 35px;

    .sensor {
      width: 200px;
      height: auto;
      margin-bottom: 14px;
    }

    &:nth-child(2),
    &:nth-child(3) {
      margin-left: 46px;
    }

    p {
      font-size: 30px;
      line-height: 27px;
    }
  }
`;
