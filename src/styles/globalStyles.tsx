import { css } from '@emotion/react';

export const globalStyles = css`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #fff;
    color: #4B4B4B;
    -webkit-font-smoothing: antialiased;
  }

  body, input, textarea, button { /* Por padrão esses elementos(input, textarea, button. Não herdam a font do body, eles tem sua própria customização de font */
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 1rem;
  }  
`
