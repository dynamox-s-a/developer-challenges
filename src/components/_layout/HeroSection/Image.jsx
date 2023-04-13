import React from 'react'

const Image = ({ image }) => {
  return (
    <div className='flex flex-[2]'>
      <img 
        src={image}
        alt="desktop and mobile"
        className='object-contain -mt-20'
      />
    </div>
  )
}

export default Image