import { useState } from "react";
import { NavLink } from "../ui/nav-link";
import { MenuIconStyled, Nav } from "./header-nav.styles";
import { Modal } from "../ui/modal";

interface HeaderNavProsp {
  type: 'mobile' | 'desktop'
}

export function HeaderNav({ type }: HeaderNavProsp){
  const [isModalOpen, setModalOpen] = useState(false)

  if(type === 'mobile'){
    return  (
      <>
        <MenuIconStyled onClick={() => setModalOpen(true)} />
        {isModalOpen && <Modal setModalOpen={setModalOpen}/>}
      </>
    )
  }

  if(type === 'desktop'){
    return (
      <Nav>
        <NavLink to={'/'}>
          Home
        </NavLink>
        <NavLink to="/aplications">
          Aplications
        </NavLink>
        <NavLink  to="/content">
          Content
        </NavLink>
        <NavLink  to="/company">
          Company
        </NavLink>
      </Nav>
    )
  }
}