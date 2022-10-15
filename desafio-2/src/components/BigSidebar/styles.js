import styled from "styled-components";

export const Contanier = styled.aside`
  display: none;
  width: 250px;

  margin-top: -17px;
  @media (min-width: 992px) {
    display: block;
    box-shadow: 1px 0px 0px 0px rgba(0, 0, 0, 0.1);
  }
`;

export const SidebarContanier = styled.aside`
  margin-left: -50px;
  background-color: #ffffff;
  height: 90.05vh;
  transition: 0.3s ease-in-out all;
`;
export const Content = styled.div`
  position: sticky;
  top: 0;
`;
