'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { DashboardDrawer } from '@/components/dashboard/drawer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {' '}
      <DashboardDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: 'background.default',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
