import styled from "styled-components";

export const B = styled.button`
  width: 190px;
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

export const Title = styled.h2`
  color: #ffffff;
  margin: 0;
  text-transform: capitalize;
`;
