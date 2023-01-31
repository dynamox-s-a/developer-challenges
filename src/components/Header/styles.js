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

  @media (min-width: 768px) and (max-width: 1300px) {
    .logo {
      width: 142px;
      height: auto;
      margin-left: -60px;
      margin-top: 8px;
    }

    a {
      font-size: 18px;
    }
    a:nth-child(3) {
      margin-right: 15px;
    }
  }

  @media (max-width: 767px) {
    .logo {
      width: 102px;
      height: auto;
      margin-left: -80px;
      margin-top: 8px;
    }

    a {
      font-size: 18px;
    }
    a:nth-child(3) {
      margin-right: 15px;
    }
  }
`;
