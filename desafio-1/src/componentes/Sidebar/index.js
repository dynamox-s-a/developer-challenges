import React from "react";
import {
  CloseIcon,
  Icon,
  SidebarContainer,
  LinkExterno,
  Linkbox,
  Link,
  SidebarMenu,
  SidebarWrapper,
  LogoContainer,
} from "./SidebarElements";
import links from "../../assets/links";
import logo from "../../assets/logo-dynamox.svg";

export const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <LogoContainer>
            <LinkExterno href="https://dynamox.net/" target="_blank">
              <img src={logo} />
            </LinkExterno>
          </LogoContainer>
          <Linkbox>
            <LinkExterno
              href="https://dynamox.net/dynapredict/"
              target="_blank"
            >
              DynaPredict
            </LinkExterno>
          </Linkbox>
          {links.map((link) => {
            return (
              <Linkbox key={link.id}>
                <Link to={link.to} onClick={toggle}>
                  {link.name}
                </Link>
              </Linkbox>
            );
          })}
        </SidebarMenu>
      </SidebarWrapper>
    </SidebarContainer>
  );
};
