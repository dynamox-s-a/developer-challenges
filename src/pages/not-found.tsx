import { Box, Button, Link, Typography, useTheme } from '@mui/material'
import DynamoxWineLogo from '/dynamox-logo-wine.svg'

export function NotFound() {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        gap: '16px',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box sx={{ width: '160px', marginBottom: '42px' }}>
        <img src={DynamoxWineLogo} alt="" />
      </Box>

      <Box sx={{ width: '70%', fontSize: '0.875rem', marginBottom: '16px' }}>
        <Typography variant="h4">Página não encontrada</Typography>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          Você deseja voltar para nossa página inicial ?
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '12px' }}>
        <Link href="/">
          <Button sx={{ width: '200px', padding: '8px' }} variant="contained">
            Home
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
