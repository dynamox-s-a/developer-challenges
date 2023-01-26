import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-image: url("/grafismo.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow-x: hidden;

  .desktopAndMobile {
    height: 627px;
    width: auto;
  }

  @media (min-width: 768px) and (max-width: 1300px) {
    .desktopAndMobile {
      height: 387px;
      width: auto;
    }
  }

  @media (max-width: 767px) {
    background-size: 145% 120%;
    height: 180px;
    background-position:  top left;
    .desktopAndMobile {
      display: none;
    }
  }
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
    width: 472px;
  }

  .logoDynapredict {
    margin-top: 31px;
    width: 161px;
    height: auto;
  }

  @media (min-width: 768px) and (max-width: 1300px) {
    margin: 74px 8px 0 46px;

    h1 {
      font-size: 50px;
      width: 272px;
      line-height: 54px;
    }

    .logoDynapredict {
      margin-top: 15px;
      width: 141px;
      height: auto;
    }
  }

  @media (max-width: 767px) {
    margin: 20px 0px 0 -20px;

    h1 {
      font-size: 40px;
      width: 272px;
      line-height: 44px;
    }

    .logoDynapredict {
      margin-top: 15px;
      width: 141px;
      height: auto;
    }
  }
`;
