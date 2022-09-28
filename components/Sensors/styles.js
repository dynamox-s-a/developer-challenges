import styled from 'styled-components'

export const SensorsContainer = styled.section`
  position: relative;
  width: 100%;
  height: 82rem;
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

  p {
    font-size: 2.4rem;
    line-height: 3.7rem;    
    color: ${props => props.theme['text']};
    text-align: center;
    margin-bottom: 2.7rem;
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
      background: ${props => props.theme['blue']};
    }
  }
`

export const ImagesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6.6rem;
`