import React from 'react'



function Header() {

  return (
    <div className=" bg-[#263252]"> 

    <header className="justify-between container flex max-w-screen-xl marker:flex-row  px-12 text-center bg-[#263252] ">
      <div > 
      <a href="https://dynamox.net/" target="_blank" rel="Dynamox">
          <img src="../src/assets/logo-dynamox.svg" alt="logo Dinamox" />
        </a>
        
      </div>
    <div className="flex items-end"> 
    <a href=" https://dynamox.net/dynapredict/" target="_blank" rel="Dynamox"className="text-white p-2" >
        DynaPredict</a>
        <a href="#sensors"  className="text-white p-2" >
        <span className="text-white p-2 ">Sensores</span>
        </a>
        <a href="#contact"  className="text-white p-2" >
        <span className="text-white p-2 ">Contatos</span>
        </a>
   </div>
    </header>
    </div>

  )
}

export default Header
