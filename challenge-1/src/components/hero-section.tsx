import { Box, Typography, useTheme } from '@mui/material'
import { HeroCarousel } from './hero-carousel'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const words = [
  'mais produtiva',
  'mais segura',
  'mais confiável',
  'mais inovadora',
  'mais colaborativa',
]

export function HeroSection() {
  const theme = useTheme()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: '40px', lg: '80px' },
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        py: 0,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '140%',
          backgroundImage: 'url("/mask-texture.webp")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          opacity: 1,
          zIndex: 1,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          textAlign: 'center',
          maxWidth: '938px',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <img
          src="/dynamox-logo-wine.svg"
          alt="Dynamox - Soluções para Indústria 4.0"
          width="152"
          height="64"
          loading="eager"
          fetchPriority="high"
        />

        <Box>
          <Typography
            sx={{ fontSize: { xs: '40px', lg: '80px' }, color: theme.palette.text.secondary }}
          >
            Juntos por uma indústria
          </Typography>

          <Box
            sx={{
              fontSize: { xs: '40px', lg: '80px' },
              color: theme.palette.primary.main,
              marginTop: { xs: '-16px', lg: '-32px' },
              fontWeight: '600',
              height: { xs: '48px', lg: '96px' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <motion.div
              key={currentWordIndex}
              initial={{ y: 80, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 22,
                },
              }}
              exit={{
                y: -50,
                opacity: 0,
                transition: { duration: 0.2 },
              }}
            >
              <Typography
                sx={{
                  fontSize: 'inherit',
                  color: 'inherit',
                  fontWeight: 'inherit',
                  lineHeight: 1,
                }}
              >
                {words[currentWordIndex]}
              </Typography>
            </motion.div>
          </Box>
        </Box>

        <Typography sx={{ fontSize: { xs: '16px', lg: '20px' }, fontWeight: 500 }}>
          Esse manifesto é a consolidação da nossa missão de impactar positivamente o mercado de
          soluções para indústria com produtos de qualidade e conexão de ponta a ponta.
        </Typography>
      </Box>
      <HeroCarousel />
    </Box>
  )
}
