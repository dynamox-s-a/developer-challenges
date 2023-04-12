import React from 'react'

import { title, logo } from '../../../data/hero';

const Title = () => {
  return (
    <div className='flex flex-col items-start flex-[6] gap-8 pl-24 pt-36'>
      
      <h1 className='text-[5rem] leading-[5.87rem] font-bold text-left text-white'>
        {title}
      </h1>

      <a
        href={logo.link}
      >
        <img 
            src={logo.image}
            alt="dynamox logo"          
            className='h-full'
        />
      </a>
  
    </div>
  )
}

export default Title