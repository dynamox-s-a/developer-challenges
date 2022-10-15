import styled from "styled-components";

export const Errorpg = styled.div`
  height: 100vh;
  display: grid;
  background-color: #486581;
  align-items: center;
`;
export const MsgContainer = styled.div`
  text-align: center;
`;
export const Msg = styled.h1`
  color: #ffffff;
  font-size: 40px;
  margin-bottom: 80px;
`;

export const BtnContanier = styled.div`
  width: 200px;
  height: 50px;
  border-radius: 10px;
  margin: auto;
  background-color: #627d98;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease-in-out all;
  :hover {
    background-color: #3b82f6;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  }
`;
