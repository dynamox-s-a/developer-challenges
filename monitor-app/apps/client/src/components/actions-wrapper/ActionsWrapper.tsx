import { Stack, StackProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ActionsWrapper = styled(Stack)<StackProps>({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 24,
  marginBottom: 24
})
