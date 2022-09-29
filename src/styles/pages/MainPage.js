import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *{
    border: 0;
    font-family: Arial, Helvetica, sans-serif;
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  background-color: whitesmoke;
  height: 100vh;
  width: 100%;
`;
