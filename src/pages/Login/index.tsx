import { Logo } from '../../components/Logo'
import * as S from './styles'

export function Login() {
  return (
    <S.LoginContainer>
      <S.ContentContainer>
        <Logo />
        <S.Form>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit">Log in</button>
        </S.Form>
      </S.ContentContainer>
    </S.LoginContainer>
  )
}
