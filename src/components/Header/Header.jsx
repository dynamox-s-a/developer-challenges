import { useState } from "react";
import logo from "../../assets/logo-dynamox.png";
import NavLinks from "../NavLinks/NavLinks";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function Header() {

    const  [openMenu, setOpenMenu] = useState(false)

  return (
    <header>
      <nav className="w-full max-h-32 top-0 z-[999] bg-dyna-blue border-b-2 border-gray-500">
        <div className="flex items-center justify-between pt-7 pb-6 ">
          <div className=" pl-6 md:pl-20">
            <h4>
              <a href="https://dynamox.net/" target="_blank">
                <img src={logo} alt="logo da dynamox" className="h-10 md:h-16" />
              </a>
            </h4>
          </div>
          <div className="px-7 hidden md:block">
            {/* Componente NavLinks renderizando cada item da navegação, sendo mapeado de um json */}
            <NavLinks />
          </div>

          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="z-[999] p-7 md:hidden text-gray-100"
          >
            <Bars3Icon className="h-10" />
          </div>

          <div
            className={`md:hidden absolute w-2/3 h-screen px-7 py-2 top-0 bg-dyna-blue duration-300 ${
              openMenu ? "right-0" : "hidden"
            }`}
          >
            <NavLinks setOpenMenu={setOpenMenu} openMenu={openMenu}/>
          </div>
        </div>
      </nav>
    </header>
  );
}
