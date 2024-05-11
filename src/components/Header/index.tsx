import { HeaderContainer, ContainerLinks, Link, Item } from "./styles";
import Logo from "../../assets/logo-dynamox.svg";

export function Header() {
  const scrollToSection = (sectionId: any) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HeaderContainer>
      <img src={Logo} alt="Logo Dynamox" />

      <ContainerLinks>
        <Link>
          <Item onClick={() => scrollToSection("dynapredict")}>
            DynaPredict
          </Item>
        </Link>
        <Link>
          <Item onClick={() => scrollToSection("sensores")}>Sensores</Item>
        </Link>
        <Link>
          <Item onClick={() => scrollToSection("contato")}>Contato</Item>
        </Link>
      </ContainerLinks>
    </HeaderContainer>
  );
}
