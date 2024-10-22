import * as React from 'react';
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: { xs: 'flex', lg: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: '1fr 1fr',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100%',
        }}
      >
        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
            <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
