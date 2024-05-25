import { SeparatorContainer } from "./separator.styles"

interface SeparatorProps {
  variant: 'horizontal' | 'vertical'
}

export function Separator({ variant }: SeparatorProps){
  return (
    <SeparatorContainer variant={variant}></SeparatorContainer>
  )
}

