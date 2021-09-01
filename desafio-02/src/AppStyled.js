import styled from 'styled-components';

export const MainContainer = styled.div`
display: flex;
`;

export const Container = styled.div`
display: flex;
flex-direction: column;
height: 100vh;
`;

export const Header = styled.div`
display: flex;
width: calc(100vw - 62px);
height: 64px;
background-color: #3f51B5;
color: #fff;
position: fixed;
left: 62px;
align-items: center;
font-weight: 500;
font-size: 22px;
padding-left: 10%;
padding-right: 24px;
box-shadow: 0 3px 5px rgba(57, 63, 72, 0.5);
`;

export const PageBody = styled.div`
display: flex;
flex: 3;
background-color: #fff;
margin-top: 80px;
font-size: 18px;
justify-content: center;
`;

export const Footer = styled.div`
display: flex;
min-height: 64px;
background-color: #3f51B5;
color: #fff;
align-items: center;
font-weight: 500;
font-size: 22px;
padding-left: 24px;
padding-right: 24px;
justify-content: center;
`;