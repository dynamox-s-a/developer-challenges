import logo from '../../assets/logo-dynamox.png';
import './navbar.css';

export default function NavBar() {
  return (
    <nav className="nav">
      <img className="img" alt="Dynamox Logo" src={logo} />
    </nav>
  );
}
