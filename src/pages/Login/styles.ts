import styled from 'styled-components'

export const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`

export const Form = styled.form`
  width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;

  button {
    width: 100%;
    height: 2rem;
    text-transform: uppercase;
    font-weight: 700;
    color: ${(props) => props.theme.white};
    background: ${(props) => props.theme.blue};
    transition: 0.2s;
    border: none;
    border-radius: 5px;
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
