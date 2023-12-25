import { Outlet } from 'react-router-dom';
import logo from '../../assets/logo-dynamox.png';
import './wrapPage.css';

function WrapPage() {
  return (
    <>
      <nav className="nav">
        <img className="img" alt="Dynamox Logo" src={logo} />
      </nav>
      <Outlet />
    </>
  );
}

export default WrapPage;
