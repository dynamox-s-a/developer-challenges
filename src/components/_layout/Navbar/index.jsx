import React from 'react'

import Logo from './Logo';
import Menu from './Menu';

const Header = () => {
  return (
    <div className='flex w-full justify-between h-[7.5rem] pl-20 pr-11 pt-8 pb-7
        bg-blue-primary'
    >
      <Logo />

      <Menu />
    </div>
  )
}

export default Header