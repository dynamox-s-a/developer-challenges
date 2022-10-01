import { Link } from "react-router-dom";
import '../styles/NavBar.css';

function NavBar() {
  return(
    <nav className="navbar">
      <div className="link">
      <Link
        to="/all"
      >
        Tela de Listagem de Produtos
      </Link>
      </div>
    <div className="link">
    <Link
        to="/new"
      >
        Cadastrar Produto Novo
      </Link>
    </div>
    </nav>
  )
}

export default NavBar;
