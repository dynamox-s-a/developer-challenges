'use client'

import { useState } from 'react'
import { Box, BoxProps, Stack, useMediaQuery } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import TopBar from 'components/top-bar/TopBar'
import Sidebar from 'components/sidebar/Sidebar'
import { usePathname } from 'next/navigation'

const StyledMainBox = styled(Box)<BoxProps>({
  flex: 1,
  margin: 24
})

const StyledMainBoxWhite = styled(Box)<BoxProps>({
  background: '#ffffff',
  flex: 1,
  margin: 24
})

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const drawerWidth = 240
  const pathname = usePathname()

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <TopBar isLgUp={isLgUp} handleDrawerToggle={handleDrawerToggle} />
      <Stack direction="row">
        <Sidebar
          drawerWidth={drawerWidth}
          isLgUp={isLgUp}
          isOpen={isOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        {pathname === '/dashboard' ? (
          <StyledMainBox component="main">{children}</StyledMainBox>
        ) : (
          <StyledMainBoxWhite component="main">{children}</StyledMainBoxWhite>
        )}
      </Stack>
    </>
  )
}
