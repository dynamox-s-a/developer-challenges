import Image from 'next/image'

import * as S from './styles'

function Header() {
  return (
    <S.HeaderContainer>
      <a 
        href="https://dynamox.net/"
        rel="noreferrer"
        aria-label="Dynamox Website"  
      >
        <S.ImageContainer>
          <Image 
            src="/assets/logo-dynamox.png" 
            alt=""
            layout="fill"
            priority
          />
        </S.ImageContainer>
      </a>
      <S.NavContainer>
        <a href="https://dynamox.net/dynapredict/">DynaPredict</a>
        <a href="#">Sensores</a>
        <a href="#">Contato</a>
      </S.NavContainer>
    </S.HeaderContainer>
  )
}

export default Header