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
  width: min(64rem, 100%);
  margin: 0 auto;
`

export const LogoutButton = styled.span`
  font-weight: 700;
  color: ${(props) => props.theme.blue};
`
