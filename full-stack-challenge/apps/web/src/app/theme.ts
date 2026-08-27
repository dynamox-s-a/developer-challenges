import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B3A5B',
      light: '#1A5F8F',
      dark: '#072A42',
    },
    secondary: {
      main: '#00A3A1',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
