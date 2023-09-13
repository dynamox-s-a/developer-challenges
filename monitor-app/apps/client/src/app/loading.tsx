'use client'
import { Backdrop, Box, LinearProgress, Typography } from '@mui/material'

export default function Loading() {
  return (
    <Backdrop
      sx={{
        backgroundColor: '#ffffff',
        color: 'primary.main',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
      open
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'sm',
          px: 5
        }}
      >
        <LinearProgress />
        <Typography sx={{ marginTop: 2, textAlign: 'center' }}>LOADING ...</Typography>
      </Box>
    </Backdrop>
  )
}
