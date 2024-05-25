import { LinkProps, useLocation } from "react-router-dom";
import { StyledLink } from "./nav-link.styles";

export type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps){
  const { pathname } = useLocation()

  return (
    <StyledLink className={props.to === pathname ? 'active' : '' } {...props} />
  )
}