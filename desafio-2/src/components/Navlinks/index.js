import React from "react";
import links from "../../utils/links";
import { NavLinks, SingleLink, NavLink, P } from "./styles";

export const NavLinksComponent = ({ toggleSidebar }) => {
  return (
    <NavLinks>
      {links.map((link) => {
        const { id, text, path } = link;
        return (
          <SingleLink>
            <NavLink
              style={{ textDecoration: "none" }}
              key={id}
              href={path}
              onClick={toggleSidebar}
            >
              <P>{text}</P>
            </NavLink>
          </SingleLink>
        );
      })}
    </NavLinks>
  );
};
