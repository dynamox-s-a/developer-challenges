import React from 'react';
import logo from '../images/logo-dynamox.png';

function Header() {
  return (
    <header>
      <nav>
        <a href="https://dynamox.net/" target="_blank" rel="noreferrer">
          <img src={logo} alt="Dynamox-Logo" />
        </a>
        <ul>
          <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noreferrer"><li>DynaPredict</li></a>
          <a href="#sensors-section"><li>Sensores</li></a>
          <a href="#footer-section"><li>Contato</li></a>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
