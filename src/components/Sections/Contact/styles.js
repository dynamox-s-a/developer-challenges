import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #263252;

  button {
    margin-bottom: 41px;
  }
`;

export const Title = styled.h1`
  font-family: "Raleway";
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  line-height: 47px;
  text-align: center;
  color: #fff;
  margin-top: 41px;
  margin-bottom: 31px;

  @media (min-width: 768px) and (max-width: 1300px) {
    font-size: 25px;
    line-height: 28px;
  }

  @media (max-width: 767px) {
    font-size: 20px;
    line-height: 28px;
  }
`;
