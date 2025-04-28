import { useAppDispatch } from '@/store/store'
import { logout } from '@/store/thunk/auth-thunk'
import { Box, Button, Container, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { MenuIcon, Power } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useState } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  function logoutApp() {
    dispatch(logout())
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box component={'header'} sx={{ background: '#333333', color: 'white', padding: '16px' }}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'row-reverse', md: 'row' },
            fontWeight: '500',
          }}
        >
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          <Link href={'/'}>
            <Image src={'/dynamox-logo-white.svg'} alt="Logo Dynamox" width={96} height={40} />
          </Link>

          <Typography
            sx={{ display: { xs: 'none', md: 'block' }, fontSize: '16px', fontWeight: 600 }}
          >
            Admin Dashboard
          </Typography>

          {/* DESKTOP */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={logoutApp}
              variant="outlined"
              sx={{
                // background: 'white',
                color: 'white',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid white',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'roboto',
                  fontSize: '14px',
                  alignSelf: 'baseline',
                  textTransform: 'none',
                }}
              >
                Sair
              </Typography>{' '}
              <Power size={14} />
            </Button>
          </Box>
        </Container>
      </Box>

      {/* MOBILE */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: 600,
              width: '100%',
            }}
          >
            Admin Dashboard Dynamox
          </Typography>
        </MenuItem>

        <MenuItem onClick={logoutApp}>
          <Box
            sx={{
              color: '#692746',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'roboto',
                fontSize: '14px',
                textTransform: 'none',
              }}
            >
              Sair
            </Typography>
            <Power size={14} />
          </Box>
        </MenuItem>
      </Menu>
      {children}
    </>
  )
}
