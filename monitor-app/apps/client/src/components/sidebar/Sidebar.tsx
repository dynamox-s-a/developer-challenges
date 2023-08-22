'use client'
import { Box, Divider, Drawer, Stack, SvgIcon, Typography, useMediaQuery } from '@mui/material'
import NextLink from 'next/link'
import { theme } from '../../theme'
import SideNav from './SideNav'
import { Logo } from '../logo'

type SideBarProps = {
  drawerWidth: number
  isLgUp: boolean
  isOpen: boolean
  handleDrawerToggle: () => void
}

export default function Sidebar(props: SideBarProps) {
  const { drawerWidth, isLgUp, isOpen, handleDrawerToggle } = props
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  return (
    <Box component="nav" aria-label="navigation items" width={isLgUp ? drawerWidth : ''}>
      <Drawer
        variant={isLgUp ? 'permanent' : 'temporary'}
        open={isOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            left: isXlUp ? `calc((100% - ${theme.breakpoints.values.xl}px) / 2)` : '0'
          }
        }}
        sx={{
          '& .MuiDrawer-paper': {
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack sx={{ display: 'flex', flexDirection: 'row', marginTop: 8 }}>
            <Box
              component={NextLink}
              href="/dashboard"
              sx={{
                display: 'flex',
                height: 32,
                width: 32
              }}
            >
              <Logo />
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, marginLeft: 1 }}>
              <strong>monitor-app</strong>
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <SideNav />
      </Drawer>
    </Box>
  )
}
