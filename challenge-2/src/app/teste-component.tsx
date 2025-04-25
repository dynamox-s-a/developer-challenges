'use client'
import { Box, useTheme } from '@mui/material'

export function TesteComponent() {
  const theme = useTheme()
  return <Box sx={{ color: theme.palette.primary.main }}>Teste compoenente</Box>
}
