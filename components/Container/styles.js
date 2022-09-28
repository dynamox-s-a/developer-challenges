import styled from 'styled-components'

export const DefaultContainer = styled.div`
  position: relative;
  width: min(100%, 1280px);
  height: 100%;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 0 4rem;
  } 

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0 2rem;
  } 
`