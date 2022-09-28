import Image from 'next/image'

import * as S from './styles'

function Card({ src, description }) {
  return (
    <S.CardContainer>
      <S.ImageContainer>
        <Image
          src={src}
          alt={description}
          layout="fill"
          objectFit="contain"
        />
      </S.ImageContainer>
      <span>{description}</span>
    </S.CardContainer>
  )
}

export default Card