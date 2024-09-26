import { HeaderContainer, NavBar, NavBarList } from "./styles.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.ts";

export function Header() {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  return (
    <HeaderContainer>
      <NavBar>
        <NavBarList>
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={() => navigate("/machine")}>Maquinas</li>
          <li onClick={logOut}>Log Out</li>
        </NavBarList>
      </NavBar>
    </HeaderContainer>
  );
}
