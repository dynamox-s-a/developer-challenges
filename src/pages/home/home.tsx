import { Container, useTheme } from '@mui/material'

import { Helmet } from 'react-helmet-async'
import { PurposeSection } from '../../components/purpose-section'
import { HistorySection } from '../../components/paragraph-section'
import { HeroSection } from '../../components/hero-section'

export function Home() {
  const theme = useTheme()

  return (
    <>
      <Helmet title="Home" />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1348px',
          width: '100%',
          px: 2,
          py: '24px',
          mx: 'auto',
          gap: { xs: '40px', lg: '120px' },
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.background.default,
        }}
      >
        <HeroSection />

        <HistorySection />

        <PurposeSection />
      </Container>
    </>
  )
}
