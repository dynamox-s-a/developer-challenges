'use client';

import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { loadFromStorage } from '@/store/auth/authSlice';
import { store } from '@/store';
import { theme } from '@/theme';



export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
    store.dispatch(loadFromStorage());
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );
}





