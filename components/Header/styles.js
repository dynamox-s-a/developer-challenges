import styled from 'styled-components'

export const HeaderContainer = styled.header`
  position: fixed;
  width: 100vw;
  height: 12rem;
  background: ${props => props.theme['blue-dark']};
  z-index: 2;
`

export const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0;
  color: ${props => props.theme.white};
`

export const ImageContainer = styled.div`
  position: relative;
  width: 17.2rem;
  height: 6.5rem;
  margin-left: 7.7rem;
  margin-bottom: 2.4rem;
  cursor: pointer;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`

export const NavContainer = styled.nav`
  display: flex;
  gap: 3.7rem;
  margin-right: 4.3rem;
  margin-bottom: 2.9rem;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      margin-right: 0;
  } 

  a {
    text-decoration: none;
    transition: color 0.2s;
    color: ${props => props.theme.white};
    font-size: 2rem;
    font-weight: 500;
    
    &:hover {
      color: ${props => `${props.theme.white}29`};
    }

    @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      display: none;
    } 
  }
`

export const MenuContainer = styled.div`
  visibility: hidden;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
      visibility: visible;
    } 
`

export const OverflowContainer = styled.nav`
  position: fixed;
  width: 100%;
  height: 100vh;
  background: ${props => props.theme['blue-dark']};
  z-index: 2;
  display: flex;
  flex-direction: column;
  top: 0;
  right: ${props => props.show ? '0' : '-100%'};
  transition: 0.4s ease-in-out;
  box-shadow: ${props => `inset 0px 0px 5px ${props.theme['blue']}`};
`

export const CloseIconContainer = styled.div`
  color: ${props => props.theme.white};
  width: 100%;
  height: 12rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding-bottom: 2.9rem;
  padding-right: 2rem;
`

export const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 4rem;

  a {
    text-decoration: none;
    transition: color 0.2s;
    color: ${props => props.theme.white};
    font-size: 4rem;
    font-weight: 500;
    
    &:hover {
      color: ${props => `${props.theme.white}29`};
    }
  }
`