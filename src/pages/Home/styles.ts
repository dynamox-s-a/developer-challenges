import styled from 'styled-components'

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    height: 2rem;
    font-weight: 500;
    padding: 1rem;
    border-radius: 8px;
    color: ${(props) => props.theme.white};
    background: ${(props) => props.theme.blue};
    transition: 0.2s;
    cursor: pointer;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background: ${(props) => props.theme['blue-dark']};
    }
  }
`

export const TableContainer = styled.div`
  flex: 1;
  overflow: auto;
  margin-top: 2rem;
  height: 42rem;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;

    th {
      background-color: ${(props) => props.theme['blue-dark']};
      padding: 1rem;
      text-align: left;
      color: ${(props) => props.theme.white};
      font-size: 0.875rem;
      line-height: 1.6;

      &:first-child {
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }

      &:last-child {
        border-top-right-radius: 8px;
        padding-right: 1.5rem;
      }
    }

    td {
      background-color: ${(props) => props.theme['blue-700']};
      border-top: 4px solid ${(props) => props.theme.background};
      color: ${(props) => props.theme.white};
      padding: 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.6;

      &:first-child {
        padding-left: 1.5rem;
        width: 30%;
      }

      &:last-child {
        padding-right: 1.5rem;
      }
    }
  }
`

export const EditProductContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
`

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;

  &:hover {
    background-color: ${(props) => props.theme['blue-dark']};
  }
`
