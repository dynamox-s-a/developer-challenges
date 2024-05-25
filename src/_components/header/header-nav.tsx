import { useState } from "react";
import { NavLink } from "../ui/nav-link";
import { MenuIconStyled, Nav } from "./header-nav.styles";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
        <NavLink to="/solutions">
          Solutions
          <KeyboardArrowDownIcon/>
        </NavLink>
        <NavLink to="/data">
          Aplications
        </NavLink>
        <NavLink  to="/data">
          Content
        </NavLink>
        <NavLink  to="/data">
          Company
        </NavLink>
      </Nav>
    )
  }
}