import BackgDesktop from "@assets/background.jpg";
import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100%;
  overflow: hidden;

  @media (min-width: 1024px) {
    background-image: url(${BackgDesktop});
    flex-direction: row;
    justify-content: center;
  }
`;

export const Logo = styled.img`
  width: 13rem;
`;

export const Login = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 80%;

  @media (min-width: 1024px) {
    width: 50%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem auto;

  @media (min-width: 1024px) {
    margin: 2rem 0;
  }
`;

export const ErrorMessage = styled.div`
  color: var(--red-100);
  font-size: 0.8rem;
  margin-top: 3%;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const LoginImage = styled.img`
  width: 36rem;
`;
