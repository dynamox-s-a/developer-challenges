import { Link, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-dynamox.png';
import './wrapPage.css';

export default function WrapPage() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="nav">
        <Link to="/" onClick={() => navigate('/')}>
          <img className="img" alt="Dynamox Logo" src={logo} />
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
