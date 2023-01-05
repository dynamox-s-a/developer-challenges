import React from 'react';
import './navbar.css';
import logo from '../../assets-desafio-01/logo-dynamox.png';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <a href="https://dynamox.net/"><img src={logo} alt="logo" /></a>
        </div>
        <div className="navbar-links_container">
          <p><a href="https://dynamox.net/dynapredict/">DynaPredict</a></p>
          <p><a href="#Sensores">Sensores</a></p>
          <p><a href="#Contato">Contato</a></p>
        </div>
      </div>
    </div>
  )
}

export default Navbar