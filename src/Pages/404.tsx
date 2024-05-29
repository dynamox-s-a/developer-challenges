import { Box, Button, Link, Typography } from "@mui/material";

import DynamoxWineLogo from '../../src/assets/dynamox-logo-wine.svg'

export function NotFound() {
  return (
    <Box sx={{ display: 'flex', alignItems:'center', flexDirection: 'column', textAlign: 'center', gap: '16px', justifyContent: 'center', height: '100vh'}}>
      <Box sx={{ width: '160px', marginBottom: '42px' }}>
        <img src={DynamoxWineLogo} alt="" />
      </Box>
      <Box sx={{ width: '70%', fontSize: '0.875rem', marginBottom: '16px' }}>
        <Typography variant="h4">Need help finding something else?</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row'}, gap: '12px'}}>
        <Link href="/">
        <Button sx={{ width: '200px', padding: '8px' }} variant="outlined">
            Home
          </Button>
        </Link>
        <Link href="/data">
          <Button sx={{ width: '200px', padding: '8px' }} variant="contained">
            Data
          </Button>
        </Link>
      </Box>
    </Box>
  )
}
