import styled from "styled-components";

export const BannerContainer = styled.div`
  display: grid;
  text-align: center;
  align-items: center;
  height: 100vh;
  width: 80vw;
  z-index: 1;
`;

export const BannerBg = styled.div`
  position: absolute;
  text-align: center;
  top: 80px;
  right: 0;
  bottom: 0;
  padding-top: 1rem;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: -1;
`;
export const BGImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #232a34;
  z-index: -1;
`;

export const InfoContanier = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: center;
`;
export const ApresentaçãoContanier = styled.div`
  display: grid;
  align-items: flex-start;
  text-align: justify;
  height: 190px;
  width: 472px;
  margin-left: 96px;
  @media screen and (max-width: 1200px) {
    height: 300px;
    width: 600px;
    margin-top: -300px;
  }
  @media screen and (max-width: 920px) {
    height: 150px;
    width: 300px;

    position: absolute;
    top: 460px;
    left: -80px;
  }
`;

export const Texto = styled.h1`
  font-size: 80px;
  color: #ffffff;
  @media screen and (min-width: 1350px) {
    font-size: 100px;
  }
`;
export const Logo = styled.img`
  width: 161px;
  height: 31px;
  margin-top: -20px;
  margin-left: 20px;
`;
export const ImagemComputador = styled.img`
  width: 700px;
  height: 700px;
  margin-top: -100px;
  margin-left: 150px;
  @media screen and (max-width: 1350px) {
    width: 550px;
    height: 550px;
    margin-left: 70px;
  }
  @media screen and (max-width: 1200px) {
    width: 350px;
    height: 350px;
    margin-left: 0;
  }
  @media screen and (max-width: 1000px) {
    width: 350px;
    height: 350px;
    margin-left: -120px;
  }
  @media screen and (max-width: 920px) {
    display: none;
  }
`;
