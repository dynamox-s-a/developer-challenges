import React from 'react'

import logo from '../../../assets/logo-dynamox.png';

const Logo = () => {
  return (
    <a
      href="https://dynamox.net/"
    >
      <img 
          src={logo}
          alt="dynamox logo"          
          className='h-full'
      />
    </a>
  )
}

export default Logo