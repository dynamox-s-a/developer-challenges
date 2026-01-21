'use client';

import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Theme } from '@/shared/theme/theme';
import { store } from '@/store/index';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ReduxProvider>
  );
}
