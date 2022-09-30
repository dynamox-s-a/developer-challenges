import React from 'react';
import logo from '../images/logo-dynamox.png';

function Header() {
  return (
    <header className='bg-primary-blue text-white h-36'>
      <nav className='px-16 py-10 mx-auto flex items-center justify-between p-3'>
        <div>
          <a href="https://dynamox.net/" target="_blank" rel="noreferrer">
            <img className='w-44' src={logo} alt="Dynamox-Logo" />
          </a>
        </div>
        <div className='flex items-center '>
          <ul className='flex gap-16 text-xl font-normal mr-10 mt-6'>
            <a href="https://dynamox.net/dynapredict/" target="_blank" rel="noreferrer"><li>DynaPredict</li></a>
            <a href="#sensors-section"><li>Sensores</li></a>
            <a href="#footer-section"><li>Contato</li></a>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
