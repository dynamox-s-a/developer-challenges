import styled from 'styled-components';

export const Template = styled.div``;

export const PageContainer = styled.div `
    max-width:1000px;
    margin:auto;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    overflow-x: hidden;
    overflow-y: hidden !important;
`;

export const PageTitle = styled.h1`
    font-size:27px;
    padding-top: 100px;
    padding-bottom: 25px;
    text-align: center;
`;

export const PageBody = styled.div``;

export const ErrorMessage = styled.div`
    margin:10px 0px;
    background-color:#FFCACA;
    color:#00;
    border:2px solid #FF0000;
    padding;10px;
`;
