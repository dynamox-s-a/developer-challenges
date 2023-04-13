import React from 'react'

const Title = ({ title, logo }) => {
  return (
    <div className='flex flex-col flex-1 justify-end items-center gap-8 
      lg:pl-24 lg:pt-36 lg:items-start lg:justify-normal'
    >
      
      <h1 className='text-5xl font-bold text-center text-white
        lg:text-[5rem] lg:leading-[5.87rem] lg:text-left'
      >
        {title}
      </h1>

      <a
        href={logo.link}
        className='z-50'
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