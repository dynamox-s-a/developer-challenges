'use client';

import { Box } from '@mui/material';
import { Header } from './Header';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Header />
      <Box component="main" p={3}>
        {children}
      </Box>
    </Box>
  );
}