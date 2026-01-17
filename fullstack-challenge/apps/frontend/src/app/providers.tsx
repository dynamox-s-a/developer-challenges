'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Theme } from '@/shared/theme/theme';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
