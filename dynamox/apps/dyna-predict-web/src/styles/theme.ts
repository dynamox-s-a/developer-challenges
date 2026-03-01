import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#692746',
      light: '#7a2246',
    },
    secondary: {
      main: '#ecb340'
    },
    background: {
      default: '#f8f7f7',
      paper: '#ffffff',
    },
    error: {
      main: 'hsl(0, 55%, 35%)',
      light: 'hsl(0, 70%, 93%)',
      contrastText: '#ffffff',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8f7f7',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: 'hsl(152, 60%, 92%)',
          color: 'hsl(152, 45%, 28%)',
          '& .MuiAlert-icon': { color: 'hsl(152, 45%, 28%)' },
        },
        standardError: {
          backgroundColor: 'hsl(0, 70%, 93%)',
          color: 'hsl(0, 55%, 35%)',
          '& .MuiAlert-icon': { color: 'hsl(0, 55%, 35%)' },
        },
        standardWarning: {
          backgroundColor: 'hsl(38, 85%, 92%)',
          color: 'hsl(38, 70%, 30%)',
          '& .MuiAlert-icon': { color: 'hsl(38, 70%, 30%)' },
        },
        standardInfo: {
          backgroundColor: 'hsl(210, 60%, 92%)',
          color: 'hsl(210, 45%, 30%)',
          '& .MuiAlert-icon': { color: 'hsl(210, 45%, 30%)' },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
})
