import React from 'react'

import { menu } from '../../../data/navbar';
import dynamoxLogo from '../../../assets/logo-dynamox.png';

import Logo from './Logo';
import Menu from './Menu';

const Header = () => {
  return (
    <div className='flex w-full justify-center h-[7.5rem] pt-8 pb-7 
        bg-blue-primary z-50        
        lg:justify-between lg:pl-20 lg:pr-11 lg:fixed'
    >
      <Logo logo={dynamoxLogo} />

      <Menu menu={menu} />
    </div>
  )
}

export default Header