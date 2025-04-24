import { useEffect, useRef, useState } from 'react'
import { Box, styled, useMediaQuery, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { CMS_CAROUSEL_IMAGES } from '../constants/CMS_DATA'

const CarouselContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '100%',
  maxWidth: '1404px',
  margin: '0 auto',
})

const CarouselImage = styled(motion.div)({
  position: 'absolute',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  cursor: 'pointer',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: '1px solid white',
})

export function HeroCarousel() {
  const theme = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const images = CMS_CAROUSEL_IMAGES

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }, 4000)
  }

  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    startAutoSlide()
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    resetInterval()
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    resetInterval()
  }

  useEffect(() => {
    startAutoSlide()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1

  return (
    <CarouselContainer sx={{ height: isMobile ? '398px' : '598px' }}>
      <CarouselImage
        onClick={handlePrev}
        style={{
          backgroundImage: `url(${images[prevIndex].src})`,
          left: '0%',
          zIndex: 1,
          height: '368px',
          width: '100%',
          maxWidth: '654px',
          display: isMobile ? 'none' : 'block',
        }}
        initial={{ x: '-50%', opacity: 0.7 }}
        animate={{ x: '0%', opacity: 0.8 }}
        transition={{ type: 'spring', stiffness: 100 }}
      />

      {/* Imagem central */}
      <CarouselImage
        onClick={handleNext}
        key={images[currentIndex].id}
        style={{
          backgroundImage: `url(${images[currentIndex].src})`,
          // left: '50%',
          // transform: 'translateX(-50%)',
          zIndex: 2,
          height: isMobile ? '398px' : '598px',
          width: '100%',
          maxWidth: '1060px',
        }}
        initial={{ scale: 0.95, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />

      {/* Imagem da direita */}
      <CarouselImage
        onClick={handleNext}
        style={{
          backgroundImage: `url(${images[nextIndex].src})`,
          left: '50%', // Ajustado de 100% para 90%
          transform: 'translateX(-100%)',
          zIndex: 1,
          height: '368px',
          width: '100%',
          maxWidth: '654px',
          display: isMobile ? 'none' : 'block',
        }}
        initial={{ x: '50%', opacity: 0.7 }}
        animate={{ x: '0%', opacity: 0.8 }}
        transition={{ type: 'spring', stiffness: 100 }}
      />
    </CarouselContainer>
  )
}
