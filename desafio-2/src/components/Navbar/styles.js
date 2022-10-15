import styled from "styled-components";

export const ContanierNavbar = styled.nav`
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;
export const Navbarcenter = styled.div`
  display: flex;
  width: 90vw;
  align-items: center;
  justify-content: space-between;
`;
export const ToggleBtn = styled.button`
  background: transparent;
  border-color: transparent;
  font-size: 1.75rem;
  color: #829ab1;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ContanierBtn = styled.div`
  position: relative;
`;
export const Btn = styled.button`
  display: flex;
  height: 40px;
  width: 100px;
  align-items: center;
  justify-content: center;
  gap: 0 0.5rem;
  position: relative;
  cursor: pointer;
  background-color: #829ab1;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const DowpDownBtn = styled.div`
  position: absolute;
  top: 45px;
  left: 0;
  height: 40px;
  width: 100px;
  background: #829ab1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  text-align: center;
  cursor: pointer;
  border-radius: 10px;
`;
