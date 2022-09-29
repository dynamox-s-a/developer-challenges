import styled from 'styled-components'

export const Form = styled.form`
  width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  justify-content: center;
  align-items: flex-start;
  margin-top: 2rem;

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

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  label {
    font-size: 0.875rem;
    font-weight: 700;
    color: ${(props) => props.theme['blue-dark']};
  }

  input {
    height: 2rem;
    padding: 0.5rem;
    width: 100%;
    font-weight: 500;
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme['blue-dark']};
    border: 1px solid ${(props) => props.theme['blue-dark']};
    border-radius: 5px;

    &::placeholder {
      color: ${(props) => props.theme.text};
      font-weight: 400;
    }
  }
`

export const CheckBoxContainer = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(props) => props.theme['blue-dark']};
`
