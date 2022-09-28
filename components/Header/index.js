import { useState } from 'react'

import Image from 'next/image'

import Container from '../Container'
import { List, X } from 'phosphor-react'

import * as S from './styles'

function Header() {
  const [showMenu, setShowMenu] = useState(false)

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
              <List 
                onClick={() => setShowMenu(true)}
                size={24}
                cursor="pointer"
              />
            </S.MenuContainer>
          </S.NavContainer>
        </S.ContentContainer>
      </Container>
      <S.OverflowContainer show={showMenu}>
        <S.CloseIconContainer>
          <X
            onClick={() => setShowMenu(false)}
            size={24}
            cursor="pointer" 
          />
        </S.CloseIconContainer>
        <S.LinksContainer>
          <a href="https://dynamox.net/dynapredict/">DynaPredict</a>
          <a 
            href="#sensores"
            onClick={() => setShowMenu(false)}
          >
            Sensores
          </a>
          <a 
            href="#contato"
            onClick={() => setShowMenu(false)}
          >
            Contato
          </a>
        </S.LinksContainer>
      </S.OverflowContainer>
    </S.HeaderContainer>
  )
}

export default Header