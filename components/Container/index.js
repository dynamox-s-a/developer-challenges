import * as S from './styles'

function Container({ children }) {
  return (
    <S.DefaultContainer>
      {children}
    </S.DefaultContainer>
  )
}

export default Container