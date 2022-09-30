import styled from "styled-components";
import { devices } from "../Devices";

export const Container = styled.section`
  align-items: baseline;
  background: #263252;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
`;

export const BoxHeader = styled.div`
  max-width: 80rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin: 0 auto;
  @media ${devices.mobileM} {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const NavLogo = styled.a`
  height: 4rem;
  margin: 0 1.5rem;
  width: 10rem;
`;

export const ImageLogo = styled.img`
  height: 100%;
  width: 100%;
`;

export const NavGroup = styled.div`
  background: none;
  margin: 0.5rem 0;
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
`;
