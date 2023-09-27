import { Stack, StackProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export const AlertWrapper = styled(Stack)<StackProps>(({ theme }) => ({
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2)
}))
