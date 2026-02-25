'use client';

import { createTheme } from '@mui/material';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#6a2746',
    },
    secondary: {
      main: '#ecb341',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), sans-serif',
  },
});

export default theme;
