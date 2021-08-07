import styled from "styled-components";

export const Container = styled.div`
  width: 25vw;
  height: 8vh;

  input {
    background: var(--white);
    padding-left: 10px;
    color: var(--dark-grey);
    font-size: 1.4rem;
    width: 100%;
    height: 60%;
    border: none;
    font-weight: bold;
    border-radius: 5px;
    color: var(--boldgreen);
    &::placeholder {
      color: var(--boldgreen);
      font-family: 'Raleway', sans-serif;
      font-weight: lighter;
    }
    @media (max-width: 500px) {
      padding-left: 5px;
      height: 70%;
      width: 100vw;
    }
  }
  div {
    color: var(--red);
    font-size: 1.1rem;
    font-weight: bold;
    width: 100%;
    height: 40%;
    padding-left: 10px;

    @media (max-width: 500px) {
      font-size: 1rem;
    }
  }
  @media (max-width: 500px) {


      width: 100vw;
    }
`;
