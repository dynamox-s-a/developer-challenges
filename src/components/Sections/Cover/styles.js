import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-image: url("/grafismo.png");
  background-repeat: no-repeat;
  /* background-size:100% 100%; */
  background-size: cover;
  background-position: center;
  overflow-x: hidden;

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
  margin: 144px 16px 0 96px;

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
