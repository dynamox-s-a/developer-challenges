'use client';

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { handleLogout } from '@/utils/logout';

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  function onLogout() {
    handleLogout(dispatch);
    router.push('/login');
  }

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>
          Event Management
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Typography variant="body2">
              {user.email}
            </Typography>
          )}

          <Button
            color="secondary"
            variant="contained"
            onClick={onLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}