import {
  NavbarContainer,
  LogoContainer,
  LinksContanier,
  Linkbox,
  Link,
  LinkExterno,
  Icon,
} from "./navbarElements";
import { FaBars } from "react-icons/fa";
import logo from "../../assets/logo-dynamox.svg";
import links from "../../assets/links";

export function Navbar({ toggle }) {
  return (
    <NavbarContainer>
      <LogoContainer>
        <LinkExterno href="https://dynamox.net/" target="_blank">
          <img src={logo} />
        </LinkExterno>
      </LogoContainer>

      <LinksContanier>
        <Icon onClick={toggle}>
          <FaBars color="#ffffff" size={40} />
        </Icon>
        <Linkbox>
          <LinkExterno href="https://dynamox.net/dynapredict/" target="_blank">
            DynaPredict
          </LinkExterno>
        </Linkbox>
        {links.map((link) => {
          return (
            <Linkbox key={link.id}>
              <Link to={link.to}>{link.name}</Link>
            </Linkbox>
          );
        })}
      </LinksContanier>
    </NavbarContainer>
  );
}
