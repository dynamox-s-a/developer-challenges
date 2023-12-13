import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root{
  --white: #F4F7FC;
  --grey-200: #454545;
  --grey-300: #37383D;
  --blue-200: #5D7A8C;
  --blue-300: #0165DB;
  --blue-400: #263252;
  --red-100: #ff4c4c;
  }

  body {
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  color: var(--grey-200);
  background-color: var(--white);
  
  }

  body, input, textarea, button {
    font-family: 'Raleway', sans-serif;
    font-weight: 400;
    font-size: 16px;
  }

  input {
    background-color: transparent !important;
  }

  button {
    &:hover:not([disabled]) {
      transform: scale(1.05);
    }

    &:active:not([disabled]) {
      transform: scale(0.95);
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }


  [disabled] {
    opacity: 0.6;
    cursor: not-allowed
  }

  ::-webkit-scrollbar {
    width: 0.4rem;
  }

  ::-webkit-scrollbar-track {
    background: var(--blue-200);
  }

  ::-webkit-scrollbar-thumb {
    background-color: var(--blue-400);
    border-radius: 20px;
  }
`;
