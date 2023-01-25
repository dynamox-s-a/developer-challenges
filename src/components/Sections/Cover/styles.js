import styled from "styled-components";
import grafismo from "@/assets/images/grafismo.png";

export const Container = styled.section`
  display: flex;
  flex-direction: row;
  background-image: linear-gradient(black, black);
  /* background-image: url(${grafismo}); */
  background-repeat: no-repeat;
  background-size: auto;
  background-position: center;

  .desktopAndMobile {
    height: 627px;
    width: auto;
  }
  /* @media (max-width: 1140px) {
    .logo {
      width: 62px;
      height: 30px;
    } */
  /* } */
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  display: table-caption;
  margin: 144px 16px 0 105px;

  h1 {
    font-family: "Raleway";
    font-style: normal;
    font-weight: 700;
    font-size: 80px;
    line-height: 94px;
    color: #ffffff;
  }

  .logoDynapredict {
    margin-top: 31px;
    width: 161px;
    height: auto;
  }
`;