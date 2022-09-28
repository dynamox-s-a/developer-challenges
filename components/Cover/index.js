import Image from 'next/image'

import Container from '../Container'

import * as S from './styles'

function Cover() {
  return(
    <S.CoverContainer>
      <Container>
        <S.OverallContainer>
          <S.LeftContainer>
            <h1>Solução DynaPredict</h1>
            <S.LogoContainer>
              <Image
                src="/assets/logo-dynapredict.png"
                alt=""
                layout="fill"
              />
            </S.LogoContainer>
          </S.LeftContainer>
          <S.RightContainer>
            <S.DesktopMobileImageContainer>
              <Image 
                src="/assets/desktop-and-mobile.png"
                alt=""
                layout="fill"
                objectFit="contain"
              />
            </S.DesktopMobileImageContainer>
          </S.RightContainer>
        </S.OverallContainer>
      </Container>

      <Image 
        src="/assets/grafismo.png"
        alt=""
        layout="fill"
      />
    </S.CoverContainer>
  )
}

export default Cover