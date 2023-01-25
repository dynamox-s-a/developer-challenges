import styled from "styled-components";

export const Container = styled.section`
  display: flex;

  .logo {
    width: 172px;
    height: 65px;
  }

  a {
    text-decoration: none;
    font-family: "Raleway", sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 23px;
    color: #fff;
    margin-left: 37px;
    cursor: pointer;
  }

  a:nth-child(1) {
    margin-left: 0px;
  }

  a:nth-child(3) {
    margin-right: 30px;
  }

  /* @media (max-width: 1140px) {
    .logo {
      width: 62px;
      height: 30px;
    } */
  /* } */
`;
