import { APP_ROUTES } from '@/context/auth-context'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { logout } from '@/store/thunk/auth-thunk'
import { Box, Button, Container, Link, Typography, IconButton, Menu, MenuItem } from '@mui/material'
import { Power, Menu as MenuIcon } from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useState } from 'react'

interface PrivateLayoutProps {
  children: ReactNode
}

export function PrivateLayout({ children }: PrivateLayoutProps) {
  const dispatch = useAppDispatch()
  const { isAdmin } = useAppSelector((state) => state.auth)
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
      <Box component={'header'} sx={{ background: '#692746', color: 'white', padding: '16px' }}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row-reverse', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '500',
          }}
        >
          {/* Hamburger Menu Icon - visível apenas em telas menores */}
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

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href={'/'}>
              <Image src={'/dynamox-logo-white.svg'} alt="Logo Dynamox" width={96} height={40} />
            </Link>
          </Box>

          <Typography
            sx={{ fontSize: '16px', fontWeight: 600, display: { xs: 'none', md: 'block' } }}
          >
            Eventos da dynamox
          </Typography>

          {/*DESKTOP */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '8px' }}>
            {isAdmin && (
              <Link
                href={APP_ROUTES.admin.dashboard}
                underline="none"
                sx={{
                  background: '#ECB340',
                  color: '#333333',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6px 16px',
                  borderRadius: '4px',
                  fontWeight: 500,
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
                  Dashboard Admin
                </Typography>
              </Link>
            )}

            <Button
              onClick={logoutApp}
              variant="outlined"
              sx={{
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
              </Typography>
              <Power size={14} />
            </Button>
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
                Eventos da Dynamox
              </Typography>
            </MenuItem>

            {isAdmin && (
              <MenuItem onClick={handleMenuClose}>
                <Link
                  href={APP_ROUTES.admin.dashboard}
                  underline="none"
                  sx={{
                    background: '#ECB340',
                    color: '#333333',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px 16px',
                    borderRadius: '4px',
                    fontWeight: 500,
                    width: '100%',
                  }}
                >
                  Dashboard Admin
                </Link>
              </MenuItem>
            )}

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
        </Container>
      </Box>
      {children}
    </>
  )
}
