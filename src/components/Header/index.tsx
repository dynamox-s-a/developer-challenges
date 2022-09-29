import { SignOut } from 'phosphor-react'
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
          <S.LogoutButton title="Log out">
            <SignOut size={24} />
          </S.LogoutButton>
        </NavLink>
      </S.ContentContainer>
    </S.HeaderContainer>
  )
}
