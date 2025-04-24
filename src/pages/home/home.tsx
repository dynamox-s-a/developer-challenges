import { Box, useTheme } from '@mui/material'

import { Helmet } from 'react-helmet-async'
import { PurposeSection } from '../../components/purpose-section'

export function Home() {
  const theme = useTheme()

  return (
    <>
      <Helmet title="Home" />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          background: theme.palette.background.default,
        }}
      >
        <div>teste</div>

        <PurposeSection />
      </Box>
    </>
  )
}
