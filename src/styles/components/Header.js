import styled from "styled-components";

export const Container = styled.section`
  align-items: baseline;
  background: #263252;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
`;

export const BoxHeader = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 80rem;
  width: 100%;
  @media screen and (max-width: 375px) {
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
`;

export const NavLogo = styled.a`
  height: 4rem;
  margin: 0 1.5rem;
  width: 10rem;
  @media screen and (max-width: 375px) {
    height: 3rem;
    width: 7.5rem;
  }
`;

export const ImageLogo = styled.img`
  height: 100%;
  width: 100%;
`;

export const NavGroup = styled.div`
  display: flex;
  flex-direction: row;
  background: none;
  margin: 0.5rem 0;
  @media screen and (max-width: 375px) {
    flex-direction: column;
    background-color: whitesmoke;
    width: 100%;
    border-radius: 0.25rem;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    margin: 3rem;
  }
`;

export const NavDynaPredict = styled.a`
  background: none;
  color: #ffffff;
  font-family: "Raleway", sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0 1rem;
  text-align: center;
  text-decoration: none;
  width: 7.5rem;
  @media screen and (max-width: 375px) {
    color: #37383d;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid lightgray;
    border-radius: 0.25rem 0.25rem 0rem 0rem;
    height: 2rem;
    font-size: 1rem;
  }
`;

export const NavSensores = styled.a`
  background: none;
  color: #ffffff;
  font-family: "Raleway", sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0 1rem;
  text-align: center;
  text-decoration: none;
  @media screen and (max-width: 375px) {
    color: #37383d;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid lightgray;
    height: 2rem;
    font-size: 1rem;
  }
`;

export const NavContato = styled.a`
  background: none;
  color: #ffffff;
  font-family: "Raleway", sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0 1rem;
  text-align: center;
  text-decoration: none;
  @media screen and (max-width: 375px) {
    color: #37383d;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid lightgray;
    border-radius: 0rem 0rem 0.25rem 0.25rem;
    height: 2rem;
    font-size: 1rem;
  }
`;
