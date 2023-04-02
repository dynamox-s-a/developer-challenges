import menuLinks from '../../json/menuLinks.json';

export default function NavLinks({setOpenMenu, openMenu}) {
  return (
    <ul className="flex flex-col justify-center items-end h-full md:flex-row md:items-center gap-9 text-xl font-medium text-white">
      {menuLinks?.map((menu, i) => (
        <li key={i} className="">
          <a href={menu.link} onClick={() => setOpenMenu(!openMenu)}>{menu?.name}</a>
        </li>
      ))}
    </ul>
  )
}
