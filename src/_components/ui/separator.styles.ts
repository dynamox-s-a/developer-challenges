import styled from "@emotion/styled";

interface SeparatorContainerProps {
  variant: 'horizontal' | 'vertical'
}

export const SeparatorContainer = styled.div<SeparatorContainerProps>`
  width: ${props => props.variant === 'horizontal' ? '100%' : '1px'}; 
  height: ${props => props.variant === 'horizontal' ? '1px' : '100%'}; // Correção aqui  
  background: #D9D9D9;
`
