import { createGlobalStyle } from "styled-components"

export default createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: 0;
    }
    :root{
        --white: #f5f5f5;
        --green: #2f5d62;
        --boldgreen: #454545;
        --yellow: #ffe268;
        --orange: #ffb037;
        --link: #faf1e6;
        --black: #0c0d0d;
        --gray: #666360;
        --red: #c53030;
        --blue: #263252
    }
    body{
        background: var(--white) ;
        color: var(--white);
    }
    body, input, button{
        font-family: 'PT-serif', serif;
    }
    h1,h2,h3,h4,h5,h6{
        font-family:'Roboto Mono', monospace;
        font-weight: 700
    }
    button{
        cursor: pointer;
    }
    a{
        text-decoration:none
    }
    html {
    overflow: scroll;
    overflow-x: hidden;
    }
    ::-webkit-scrollbar {
        width: 0px;
    }
`
