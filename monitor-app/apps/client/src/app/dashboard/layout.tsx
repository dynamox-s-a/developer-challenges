'use client'
import { useState } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import TopBar from 'components/top-bar/TopBar'
import Sidebar from 'components/sidebar/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen)
  }

  const drawerWidth = 240

  return (
    <>
      <TopBar isLgUp={isLgUp} handleDrawerToggle={handleDrawerToggle} />
      <Box sx={{ display: 'flex' }}>
        <Sidebar
          drawerWidth={drawerWidth}
          isLgUp={isLgUp}
          isOpen={isOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  )
}
