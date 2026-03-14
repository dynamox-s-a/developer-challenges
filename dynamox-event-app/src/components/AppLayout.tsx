'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  IconButton
} from '@mui/material';

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';

export default function AppLayout({ children }: { children: React.ReactNode }) {

  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      <AppBar position="static" color="inherit" elevation={0} sx={{borderBottom: '1px #dcdfe5 solid'}}>
        <Toolbar sx={{justifyContent: 'space-between'}}>

          <Stack direction="row" spacing={1.5} alignItems="center">

            <Box
              sx={{
                p: 1,
                borderRadius: 1,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex'
              }}
            >
              <ConfirmationNumberIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>

            <Typography variant="h6" fontWeight="bold">
              EventHub
            </Typography>

          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: 'none', sm: 'flex' }, mr: 2 }}
          >

            {user?.role === 'admin' && (
              <Button
                startIcon={<DashboardIcon />}
                variant={isActive('/dashboard') ? 'contained' : 'text'}
                onClick={() => router.push('/dashboard')}
              >
                Dashboard
              </Button>
            )}

            <Button
              startIcon={<CalendarMonthIcon />}
              variant={isActive('/events') ? 'contained' : 'text'}
              onClick={() => router.push('/events')}
            >
              Eventos
            </Button>

          </Stack>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >

            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography fontSize={14} fontWeight={500}>
                {user?.name}
              </Typography>

              <Typography fontSize={12} color="text.secondary" textTransform="capitalize">
                {user?.role}
              </Typography>
            </Box>

            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>

          </Stack>

        </Toolbar>

        {/* Mobile */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            borderTop: '1px solid',
            borderColor: 'divider',
            px: 2,
            py: 1,
            gap: 1
          }}
        >

          {user?.role === 'admin' && (
            <Button
              fullWidth
              startIcon={<DashboardIcon />}
              variant={isActive('/dashboard') ? 'contained' : 'text'}
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </Button>
          )}

          <Button
            fullWidth
            startIcon={<CalendarMonthIcon />}
            variant={isActive('/events') ? 'contained' : 'text'}
            onClick={() => router.push('/events')}
          >
            Events
          </Button>

        </Box>

      </AppBar>

      <Container sx={{ flex: 1, py: 4 }} maxWidth={false}>
        {children}
      </Container>

    </Box>
  );
}