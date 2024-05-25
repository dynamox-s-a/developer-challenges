import { NavLink } from './nav-link'
import { ModalContainer, NavContainer } from "./modal.styles"
import CloseIcon from '@mui/icons-material/Close';

interface ModalProps {
  setModalOpen: (arg: boolean) => void
}

export function Modal({ setModalOpen }: ModalProps){
  return (
    <ModalContainer>
      <header>
        <span>Menu</span>
        <button onClick={() => setModalOpen(false)}>
          <CloseIcon />
        </button>
      </header>

      <NavContainer>
        <NavLink onClick={() => setModalOpen(false)} to={'/'}>
          Home
        </NavLink>
        <NavLink onClick={() => setModalOpen(false)} to="/data">
          Data
        </NavLink>
        <NavLink onClick={() => setModalOpen(false)} to="/solutions">
          Solutions
        </NavLink>
        <NavLink onClick={() => setModalOpen(false)}  to="/aplications">
          Aplications
        </NavLink>
        <NavLink onClick={() => setModalOpen(false)}  to="/content">
          Content
        </NavLink>
        <NavLink onClick={() => setModalOpen(false)} to="/company">
          Company
        </NavLink>
      </NavContainer>
    </ModalContainer>
  )
}