import { Container, useTheme } from '@mui/material'

import { PurposeSection } from '../../components/purpose-section'
import { HistorySection } from '../../components/paragraph-section'
import { HeroSection } from '../../components/hero-section'
import { Seo } from '../../seo'

export function Home() {
  const theme = useTheme()

  return (
    <>
      <Seo
        title="Home | Dynamox"
        description="Tecnologia para monitoramento contínuo de vibração e temperatura em máquinas industriais"
        image="https://dynamox.net/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fccorp-public-assets%2FDynamox%2520assets%2Flogo-dynamox-white.webp&w=256&q=75"
      />

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
