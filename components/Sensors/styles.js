import styled from 'styled-components'

export const SensorsContainer = styled.section`
  position: relative;
  width: 100%;
  padding-top: 9.5rem;
  padding-bottom: 4rem;
`

export const ArticleContainer = styled.article`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 4rem;
    line-height: 5.4rem;
    font-weight: 700;
    color: ${props => props.theme['title']};
    text-align: center;
  }

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 3.7rem;
    width: 18.3rem;
    height: 3.9rem;
    font-size: 2rem;
    line-height: 2.3rem;
    font-weight: 700;
    text-transform: uppercase;
    text-decoration: none;
    color: ${props => props.theme.white};
    background: ${props => props.theme['blue-dark']};
    border-radius: 5px;
    transition: 0.2s;

    &:hover {
      background: ${props => props.theme['blue-700']};
    }
  }
`

export const DesktopParagraph = styled.p`
  font-size: 2.4rem;
  line-height: 3.95rem;    
  color: ${props => props.theme['text']};
  text-align: center;
  margin-bottom: 2.7rem;

  @media (max-width: 990px) {
    display: none;
  } 
`

export const MobileParagraph = styled(DesktopParagraph)`
  margin-top: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  text-align: justify;
  display: none;

  @media (max-width: 990px) {
    display: block;
  } 

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
    margin-right: 0;
  } 
`

export const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6.6rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  } 
`