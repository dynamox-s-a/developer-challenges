import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { Link as LinkS } from "react-scroll";

export const SidebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  background: #263252;
  display: grid;
  align-items: center;
  top: 0;

  transition: 0.3s ease-in-out;
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  top: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

export const CloseIcon = styled(FaTimes)`
  color: #fff;
`;

export const Icon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
`;

export const SidebarWrapper = styled.div`
  color: #ffffff;
`;
export const SidebarLink = styled(LinkS)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  list-style: none;
  transition: 0.2 ease-in-out;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  &:hover {
    color: #01bf71;
    transition: 0.2s ease-in-out;
  }
`;

export const SidebarMenu = styled.ul`
  display: grid;
  grid-template-rows: repeat(6, 80px);
  text-align: center;
  justify-content: center;
  @media screen and (max-width: 480px) {
    grid-template-rows: repeat(6, 60px);
  }
`;
export const Linkbox = styled.div`
  display: grid;
  height: 23px;
  width: 140px;
  align-items: center;
  justify-content: center;
`;
export const Link = styled(LinkS)`
  color: white;
  cursor: pointer;
  font-size: 35px;
`;
export const LogoContainer = styled.div`
  position: absolute;
  width: 172.86px;
  height: 65.15px;
  left: 30px;
  top: 30.23px;
`;
export const LinkExterno = styled.a`
  color: white;
  cursor: pointer;
  font-size: 35px;
  text-decoration: none;
`;
