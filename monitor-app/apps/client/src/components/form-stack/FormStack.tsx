import { Stack, StackProps } from '@mui/material'
import { styled } from '@mui/material/styles'

export const FormStack = styled(Stack)<StackProps>(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0
}))

export default FormStack
