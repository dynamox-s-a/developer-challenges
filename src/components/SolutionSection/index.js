import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import styles from '@component/components/SolutionSection/SolutionSection.module.css'
import Image from 'next/image'
import dynaRredict from '@assets/logo-dynapredict.png'
import desktopMobilePic from '@assets/desktop-and-mobile.png'

export default function SolutionSection() {
  return (
    <Box
      className={styles.bgContainer}
    >
      <Box className={styles.boxContainer}>
        <Typography
          component='h2'
          variant='h2'
        >
          Solução DynaPredict
        </Typography>
        <Image 
          src={dynaRredict}
          alt='Logo DynaPredict'
          width={178}
          height={35}
          priority
        />
      </Box>
      <Image 
        src={desktopMobilePic}
        alt='Foto com notebook e um celular'
        className={styles.desktopMobilePic}
      />
    </Box>
  )
}
