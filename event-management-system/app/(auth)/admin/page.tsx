'use client';

import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  return (
    <>
      <Typography variant="h4">
        Admin Dashboard
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => router.push('/events')}
      >
        Go to Events
      </Button>
    </>
  );
}