import { Navigation } from './Navigation'
import { FiMenu } from 'react-icons/fi'
import { IoIosClose } from 'react-icons/io'
import { useState } from 'react'

export function MobileNav() {

  const [openMenu, setOpenMenu] = useState(false)

  const hamburguerIcon = <FiMenu className="hamburguer" size='40px' color='white' onClick={() => setOpenMenu(!openMenu)} />


  const hamburguerIconClose = <IoIosClose className="hamburguer" size='40px' color='white' onClick={() => setOpenMenu(!openMenu)} />


  return (
    <nav className="menu-mobile">

      {openMenu ? hamburguerIconClose : hamburguerIcon}

      {openMenu && <Navigation />}

    </nav>
  )
}