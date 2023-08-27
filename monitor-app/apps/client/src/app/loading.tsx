'use client'
import { Backdrop, Box, LinearProgress, Typography, useMediaQuery } from '@mui/material'
import { usePathname } from 'next/navigation'
import { theme } from 'theme'

export default function Loading() {
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const pathname = usePathname()

  return (
    <Backdrop
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        color: 'primary.main',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
      open
    >
      <Box
        sx={{
          width: pathname.includes('dashboard') && isLgUp ? '50%' : '100%',
          marginLeft: isLgUp ? 30 : 0,
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
