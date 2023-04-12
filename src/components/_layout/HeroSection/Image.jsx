import React from 'react'

import { image } from '../../../data/hero';

const Image = () => {
  return (
    <div className='flex z-50 flex-[2]'>
      <img 
        src={image}
        alt="desktop and mobile"
        className='object-contain -mt-20'
      />
    </div>
  )
}

export default Image