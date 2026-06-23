import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3A3B3F',
      light: '#DFE3E8',
    },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#3A3B3F',
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '-0.00075rem',
      lineHeight: '1.5rem',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '-0.0004375rem',
      lineHeight: '1.25rem',
    },
    body1: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '-0.0004375rem',
      lineHeight: '1.3125rem',
    },
    body2: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '-0.0003rem',
      lineHeight: '0.875rem',
    },
  },
})
