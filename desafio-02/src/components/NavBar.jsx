import { Link } from "react-router-dom";

function NavBar() {
  return(
    <nav>
      <Link
        to="/all"
      >
        Tela de Listagem de Produtos
      </Link>
      <Link
        to="/new"
      >
        Cadastrar Produto novo
      </Link>
    </nav>
  )
}

export default NavBar;
