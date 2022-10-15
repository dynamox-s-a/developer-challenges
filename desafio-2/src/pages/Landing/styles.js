import styled from "styled-components";

export const LandingContanier = styled.main`
  display: grid;

  height: 100vh;
  background-color: #263252;
`;

export const Contanier = styled.div`
  width: 400px;
  height: 400px;
  justify-content: center;
  align-items: center;
  margin: auto;
`;
export const Logo = styled.img`
  width: 400px;
  height: 220px;
  object-fit: fill;
`;

export const BTNContanier = styled.div`
  margin: auto;
  margin-top: -160px;
`;

export const LoginLink = styled.div`
  width: 200px;
  height: 50px;
  border-radius: 10px;
  border: none;
  background-color: #1d4ed8;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-in-out all;
  :hover {
    background-color: #3b82f6;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }
`;

export const Link = styled.a`
  text-decoration: none;
  justify-content: center;
`;
export const Title = styled.h2`
  text-align: center;
  color: #ffffff;
  text-transform: capitalize;
  font-size: 1.25rem;
  padding: 0.5rem 1.25rem;
`;
