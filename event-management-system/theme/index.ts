import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#692746',
      dark: '#3b1d2a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ecb340',
      dark: '#d0900e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f9f6f6',
    },
    text: {
      primary: '#333333',
      secondary: '#4b4b4b',
      disabled: '#b1b1b1',
    },
    divider: '#f3edea',
    error: {
      main: '#d32f2f',
    },
    info: {
      main: '#2980b9',
    },
  },

  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontSize: '48px',
      fontWeight: 600,
    },
    h2: {
      fontSize: '32px',
      fontWeight: 600,
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
    },
    h4: {
      fontSize: '22px',
      fontWeight: 600,
    },
    h5: {
      fontSize: '20px',
      fontWeight: 600,
    },
    h6: {
      fontSize: '18px',
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 8,
  },

  spacing: 8,
});