import { Stack, StackProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export const ActionsWrapper = styled(Stack)<StackProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2)
}))
