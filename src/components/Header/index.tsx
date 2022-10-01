import { useAppSelector } from '../../store/hooks'
import logout from '../../services/logout'

import { SignOut } from 'phosphor-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Logo } from '../Logo'

import * as S from './styles'

export function Header() {
  const { isAuth } = useAppSelector((state) => state.auth)

  const navigate = useNavigate()

  function handleLogout() {
    if (isAuth) {
      logout()
    }

    navigate('login')
  }

  return (
    <S.HeaderContainer>
      <S.ContentContainer>
        <NavLink to="/">
          <Logo />
        </NavLink>
        <NavLink to="/login">
          <S.LogoutButton title="Log out" onClick={handleLogout}>
            <SignOut size={24} />
          </S.LogoutButton>
        </NavLink>
      </S.ContentContainer>
    </S.HeaderContainer>
  )
}
