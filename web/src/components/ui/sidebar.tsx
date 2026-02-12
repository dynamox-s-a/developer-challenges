'use client'

import { useState } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material'
import { Analytics, Dashboard, Logout, Menu, Person } from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { endUserSession } from '@/utils/jwt'

const Sidebar = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const closeDrawer = () => {
    setOpen(false)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Analytics', icon: <Analytics />, path: '/dashboard/analytics' },
    { text: 'Perfil', icon: <Person />, path: '/dashboard/profile' },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    closeDrawer()
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      endUserSession()
    }
    closeDrawer()
    router.push('/auth/login')
  }

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
        >
          Sensory Application
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map(item => (
          <ListItem
            key={item.text}
            disablePadding
          >
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <IconButton
        color="secondary"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
        sx={{ mr: 2 }}
      >
        <Menu />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={closeDrawer}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default Sidebar
