import { Box, Divider, Drawer, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { theme } from 'theme'
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
  return (
    <Box component="nav" aria-label="navigation items" width={isLgUp ? drawerWidth : ''}>
      <Drawer
        variant={isLgUp ? 'permanent' : 'temporary'}
        open={isOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: 8,
              justifyContent: 'space-evenly'
            }}
          >
            <Box
              component={Link}
              href="/dashboard"
              sx={{
                display: 'flex',
                height: 32,
                width: 32
              }}
            >
              <Logo />
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
              <strong>monitor-app</strong>
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <SideNav handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
    </Box>
  )
}
