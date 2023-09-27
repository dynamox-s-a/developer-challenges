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
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1
}))

const LoadingWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  marginLeft: theme.spacing(4),
  marginRight: theme.spacing(4)
}))

const LoadingText = styled(Typography)<TypographyProps>(({ theme }) => ({
  paddingTop: theme.spacing(1),
  textAlign: 'center'
}))

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
