import { useState } from "react";
import {
  HeaderContainer,
  ContainerLinks,
  Link,
  Item,
  HamburguerMenu,
  MenuIcon,
} from "./styles";
import Logo from "../../assets/logo-dynamox.svg";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (sectionId: any) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HeaderContainer>
      <img src={Logo} alt="Logo Dynamox" />
      <HamburguerMenu onClick={toggleMenu}>
        <MenuIcon isOpen={isOpen} />
      </HamburguerMenu>

      <ContainerLinks isOpen={isOpen}>
        <Link onClick={toggleMenu}>
          <Item onClick={() => scrollToSection("dynapredict")}>
            DynaPredict
          </Item>
        </Link>
        <Link onClick={toggleMenu}>
          <Item onClick={() => scrollToSection("sensores")}>Sensores</Item>
        </Link>
        <Link onClick={toggleMenu}>
          <Item onClick={() => scrollToSection("contato")}>Contato</Item>
        </Link>
      </ContainerLinks>
    </HeaderContainer>
  );
}
