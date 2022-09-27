import styled from 'styled-components'

export const CoverContainer = styled.section`
  position: relative;
  width: 100%;
  height: 72rem;
`

export const OverallContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  z-index: 1;
`

export const LeftContainer = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 14.4rem;
  padding-left: 9.6rem;
  gap: 3.1rem;

  span {
    font-size: 8rem;
    font-weight: 700;
    color: ${props => props.theme.white};
  }
`

export const LogoContainer = styled.div`
  position: relative;
  width: 16.1rem;
  height: 3.1rem;
`

export const RightContainer = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: flex-end;
`

export const DesktopMobileImageContainer = styled.div`
  position: relative;
  width: 69.2rem;
  height: 62.7rem;
`