import styled, { css } from 'styled-components'

export const PaginationContainer = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ul {
    display: flex;
    list-style-type: none;
    gap: 0.5rem;
    margin: 0 auto;
  }
`

type PaginationProps = {
  active: boolean
}

export const Item = styled.li<PaginationProps>`
  ${({ theme, active }) => css`
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => props.theme.white};
    font-weight: 700;
    background: ${active ? theme.blue : theme['blue-700']};
    transition: 0.2s;
    border: 1px solid ${(props) => props.theme['blue-700']};
    border-radius: 5px;
    cursor: pointer;

    &:not(:disabled):hover {
      background: ${(props) => props.theme.blue};
    }
  `}
`
