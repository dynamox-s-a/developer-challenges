import { useMemo, useState } from 'react'
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Container
} from '@mui/material'
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing'
import SensorsIcon from '@mui/icons-material/Sensors'
import LogoutIcon from '@mui/icons-material/Logout'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import MemoryIcon from '@mui/icons-material/Memory'


import { useAppDispatch } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'

const drawerWidth = 280

type NavItem = {
  label: string
  path: string
  icon: React.ReactNode
}

export default function AppShell() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems: NavItem[] = useMemo(
    () => [
      { label: 'Máquinas', path: '/machines', icon: <PrecisionManufacturingIcon /> },
      { label: 'Pontos de monitoramento', path: '/monitoring-points', icon: <SensorsIcon /> },
      { label: 'Sensores', path: '/sensors', icon: <MemoryIcon /> }
    ],
    []
  )

  const activePath = navItems.find((i) => location.pathname.startsWith(i.path))?.path ?? '/machines'

  const onLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, pt: 2.25, pb: 1.75 }}>
        <Typography variant="h6" sx={{ fontWeight: 950, lineHeight: 1.1 }}>
          VEKTORPREDICT
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Monitoramento de ativos
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1.25, py: 1.25 }}>
        {navItems.map((item) => {
          const selected = activePath === item.path

          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path)
                setMobileOpen(false)
              }}
              sx={{
                borderRadius: 2,
                px: 1.5,
                py: 1.2,
                mb: 0.75,
                border: '1px solid',
                borderColor: selected ? 'rgba(215, 25, 32, 0.35)' : 'rgba(148, 163, 184, 0.10)',
                bgcolor: selected ? 'rgba(215, 25, 32, 0.12)' : 'transparent',
                '&:hover': {
                  bgcolor: selected ? 'rgba(215, 25, 32, 0.16)' : 'rgba(148, 163, 184, 0.08)'
                },
                '& .MuiListItemIcon-root': {
                  minWidth: 40,
                  color: selected ? 'primary.main' : 'text.secondary'
                },
                '& .MuiListItemText-primary': {
                  fontWeight: selected ? 900 : 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{
            fontWeight: 900,
            borderRadius: 2,
            py: 1,
            borderColor: 'rgba(148, 163, 184, 0.22)',
            color: 'text.primary',
            bgcolor: 'rgba(148, 163, 184, 0.06)',
            '&:hover': { bgcolor: 'rgba(148, 163, 184, 0.10)' }
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: '#0F172A',
          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
          color: 'text.primary',
          backgroundImage: 'none',
          p: { xs: 1.5, sm: 0.90 }
        }}
      >
        <Toolbar
          sx={{
            gap: 1.5,
            minHeight: { xs: 56, sm: 64 },
            px: 2
          }}
        >

          <Box sx={{ flex: 1 }} />
        </Toolbar>
      </AppBar>


      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#0B1220',              // opaco
              backgroundImage: 'none',
              backdropFilter: 'none',          // remove blur
              borderRight: '1px solid rgba(148, 163, 184, 0.12)',
              boxShadow: 'none'                // remove “halo”
            }
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              bgcolor: '#0B1220',              // opaco
              backgroundImage: 'none',
              backdropFilter: 'none',          // remove blur
              borderRight: '1px solid rgba(148, 163, 184, 0.12)',
              boxShadow: 'none'                // remove “halo”
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: 'relative',
          minHeight: '100vh',
          backgroundImage: `url('/images/industrial-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 0
          },
          '& > *': { position: 'relative', zIndex: 1 }
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

        <Container
          maxWidth="lg"
          sx={{
            pt: 5.5,
            pb: 3
          }}
        >
          <Box
            sx={{
              bgcolor: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: 3,
              boxShadow: '0 12px 35px rgba(0,0,0,0.45)',
              border: '1px solid rgba(148, 163, 184, 0.14)',
              overflow: 'hidden',
              p: { xs: 1.5, sm: 2 }
            }}
          >
            <Outlet />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
