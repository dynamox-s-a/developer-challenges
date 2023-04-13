import React from 'react'

const Menu = ({ menu }) => {
  return (
    <div className='flex flex-row items-end gap-9 text-[1.25rem] leading-[1.47rem]'>
      {
        menu.map(item => <Link key={item.name} title={item.title} link={item.link} />)
      }
    </div>
  )
}

const Link = ({ title, link }) => {
  return(
    <a
      href={link}      
    >
      {title}
    </a>
  )
}

export default Menu