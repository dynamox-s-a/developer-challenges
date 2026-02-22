'use client';

import { Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/store/hooks';
import { handleLogout } from '@/utils/logout';

export default function EventsDashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function onLogout() {
    handleLogout(dispatch);
    router.push('/login');
  }

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Events Dashboard
      </Typography>

      <Button variant="outlined" color="error" onClick={onLogout}>
        Logout
      </Button>
    </Box>
  );
}