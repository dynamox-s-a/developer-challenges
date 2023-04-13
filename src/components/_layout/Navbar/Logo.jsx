import React from 'react'

const Logo = ({ logo }) => {
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