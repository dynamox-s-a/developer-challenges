import styled from 'styled-components'

export const CardContainer  = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 1.4rem;

  span {
    font-size: 4rem;
    line-height: 4.7rem;
    font-weight: 700;
    color: ${props => props.theme['image-description']}
  }
`

export const ImageContainer = styled.div`
  position: relative;
  width: 27.7rem;
  height: 29.8rem;
`