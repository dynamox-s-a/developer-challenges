import styled from "styled-components";
import { Link as LinkS } from "react-scroll";

export const NavbarContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  position: sticky;
  top: 0;

  height: 120px;
  width: 100%;
  background-color: #263252;
`;
export const LogoContainer = styled.div`
  position: absolute;
  width: 172.86px;
  height: 65.15px;
  left: 77px;
  top: 30.23px;
`;

export const LinksContanier = styled.div`
  margin-top: 68px;
  display: flex;
`;

export const Linkbox = styled.div`
  height: 23px;
  width: 140px;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const Link = styled(LinkS)`
  color: white;
  cursor: pointer;
`;
export const LinkExterno = styled.a`
  color: white;
  cursor: pointer;
  text-decoration: none;
`;
export const Icon = styled.div`
  display: none;
  @media screen and (max-width: 768px) {
    margin-top: 20px;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(-100%, 60%);
    font-size: 1.6rem;
    cursor: pointer;
  }
`;
