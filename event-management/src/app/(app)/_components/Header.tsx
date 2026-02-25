'use client';

import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { AppBar, Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CalendarMonth } from '@mui/icons-material';
import { clearToken } from '@/utils/token';

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    clearToken();
    router.push('/login');
  };
  return (
    <AppBar
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        maxHeight: '80px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
        <CalendarMonth sx={{ fontSize: 80, color: 'white' }} />
        <Typography sx={{ fontSize: { xs: 15, lg: 20 } }} fontWeight={800}>
          EVENT MANAGEMENT
        </Typography>
      </div>
      <Button endIcon={<LogoutIcon />} variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </AppBar>
  );
};

export default Header;
