import React from 'react'

const Button = ({ title, link }) => {
  return (
    <a 
        href={link}
        className='w-fit font-bold py-2 px-11 rounded-md bg-blue-primary text-[1.25rem] leading-[1.47rem]'
    >
        {title}
    </a>
  )
}

export default Button