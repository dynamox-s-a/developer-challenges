import { useAppDispatch } from '@/store/store'
import { logout } from '@/store/thunk/auth-thunk'
import { Box, Button, Container, Typography } from '@mui/material'
import { Power } from 'lucide-react'
import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const dispatch = useAppDispatch()

  function logoutApp() {
    dispatch(logout())
  }

  return (
    <>
      <Box component={'header'} sx={{ background: '#333333', color: 'white', padding: '16px' }}>
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: '500',
          }}
        >
          Dynamox Admin Dashboard | Eventos
          <Button
            onClick={logoutApp}
            variant="contained"
            sx={{
              background: 'white',
              color: '#333333',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ fontFamily: 'roboto', fontSize: '14px', alignSelf: 'baseline' }}>
              Sair
            </Typography>{' '}
            <Power size={14} />
          </Button>
        </Container>
      </Box>
      {children}
    </>
  )
}
