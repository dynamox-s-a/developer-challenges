import { NavLink } from 'react-router-dom'
import { Logo } from '../Logo'

import * as S from './styles'

export function Header() {
  return (
    <S.HeaderContainer>
      <S.ContentContainer>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <NavLink to="/login">
          <S.LogoutButton>Log out</S.LogoutButton>
        </NavLink>
      </S.ContentContainer>
    </S.HeaderContainer>
  )
}
