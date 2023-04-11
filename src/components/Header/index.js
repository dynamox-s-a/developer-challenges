import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import React from 'react'
import DynamoxLogo from 'assets/logo-dynamox.png'
import Image from 'next/image'
import styles from '@component/components/Header/Header.module.css'

export default function Header() {

  const links = [
    {
      title: 'DynaPredict',
      ref: 'https://dynamox.net/dynapredict/',
    },
    {
      title: 'Sensores',
      ref: '#sensors-section',
    },
    {
      title: 'Contato',
      ref: '#footer-section',
    }
  ]


  return (
    <AppBar position='static' >
      <Container maxWidth="xl">
        <Toolbar className={styles.navtoolbar}>
          <Box
            component='a'
            href='https://dynamox.net/'
            target="_blank"
          >
            <Image 
              src={DynamoxLogo} 
              alt="Dynamox logo"
              width={173}
              height={65}
              priority
            />
          </Box>
          <Box className={styles.navlinks}>
            {links.map((link) => (
              <Typography 
                key={link.title}
                component='a'
                href={link.ref}
              >
              {link.title}
              </Typography>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
