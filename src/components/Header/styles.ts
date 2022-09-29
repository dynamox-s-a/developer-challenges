import styled from 'styled-components'

export const HeaderContainer = styled.header`
  width: 100vw;
  height: 6rem;
  display: flex;
  align-items: center;
`

export const ContentContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: min(1024px, 100%);
  margin: 0 auto;
  padding: 0 2rem;
`

export const LogoutButton = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(props) => props.theme.blue};
  transition: 0.2s;

  &:hover {
    color: ${(props) => props.theme['blue-dark']};
  }
`
