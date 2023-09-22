'use client'

import {
  Backdrop,
  BackdropProps,
  Box,
  BoxProps,
  LinearProgress,
  Typography,
  TypographyProps
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledBackdrop = styled(Backdrop)<BackdropProps>(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: 'primary.main',
  zIndex: theme.zIndex.drawer + 1
}))

const LoadingWrapper = styled(Box)<BoxProps>({
  width: '100%',
  maxWidth: 600,
  marginLeft: 24,
  marginRight: 24
})

const LoadingText = styled(Typography)<TypographyProps>({
  paddingTop: 4,
  textAlign: 'center'
})

export default function Loading() {
  return (
    <StyledBackdrop open>
      <LoadingWrapper>
        <LinearProgress />
        <LoadingText>LOADING ...</LoadingText>
      </LoadingWrapper>
    </StyledBackdrop>
  )
}
