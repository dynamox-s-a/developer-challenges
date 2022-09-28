import Image from 'next/image'

import Container from '../Container'
import { List } from 'phosphor-react'

import * as S from './styles'

function Header() {
  return (
    <S.HeaderContainer>
      <Container>
        <S.ContentContainer>
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
            <a href="#sensores">Sensores</a>
            <a href="#contato">Contato</a>
            <S.MenuContainer>
              <List size={24} cursor="pointer" />
            </S.MenuContainer>
          </S.NavContainer>
        </S.ContentContainer>
      </Container>
    </S.HeaderContainer>
  )
}

export default Header