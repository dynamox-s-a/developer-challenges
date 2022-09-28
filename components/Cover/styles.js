import styled from 'styled-components'

export const CoverContainer = styled.section`
  position: relative;
  height: 84rem;
  background: ${props => props.theme['blue-dark']};
  border-bottom-left-radius: 50%;
  padding-top: 12rem;
`

export const OverallContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  z-index: 1;

  @media (max-width: 960px) {
    position: relative;
    grid-template-columns: 1fr;
  }
`

export const LeftContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 14.4rem;
  padding-left: 9.6rem;
  gap: 3.1rem;

  h1 {
    font-size: 8rem;
    font-weight: 700;
    color: ${props => props.theme.white};

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      font-size: 6rem;
   }
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding-left: 0;
  }
`

export const LogoContainer = styled.div`
  position: relative;
  width: 16.1rem;
  height: 3.1rem;
`

export const RightContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex: 1;
  justify-content: flex-end;

  @media (max-width: 960px) {
    justify-content: center;
    align-items: center;
  }
`

export const DesktopMobileImageContainer = styled.div`
  position: relative;
  width: 69.2rem;
  height: 62.7rem;

  @media (max-width: 1080px) {
    width: 62.3rem;
    height: 56rem;
  }

  @media (max-width: 1020px) {
    width: min(100%, 55.2rem);
    height: 50.2rem;
  }
`

export const BackgroundImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  @media (max-width: 1020px) {
    visibility: hidden;
  }
`