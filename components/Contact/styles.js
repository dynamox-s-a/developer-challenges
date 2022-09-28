import styled from 'styled-components'

export const ContactContainer = styled.footer`
  background: ${props => props.theme['blue-dark']};
  height: 45rem;
  padding: 4.1rem 0;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: 3rem;
    line-height: 3.5rem;
    font-weight: 700;
    color: ${props => props.theme.white};
    text-align: center;
    margin-bottom: 3.1rem;
  }

  button {
    width: 18.3rem;
    height: 3.9rem;
    text-transform: uppercase;
    font-size: 2rem;
    line-height: 2.3rem;
    font-weight: 700;
    color: ${props => props.theme.white};
    background: ${props => props.theme['blue']};
    transition: 0.2s;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: ${props => props.theme['blue-700']};
    }
  }
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: min(42.6rem, 100%);
  margin-bottom: 3rem;

  input {
    height: 4.1rem;
    line-height: 1.9rem;
    font-weight: 500;
    text-align: center;
    background: ${props => props.theme.background};
    color: ${props => props.theme['blue-dark']};
    border: none;
    border-radius: 5px;

    &::placeholder {
      color: ${props => props.theme['text']};
      font-weight: 400;
    }
  }
`