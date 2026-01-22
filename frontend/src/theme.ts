import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#7a2f54',
      dark: '#8a3f64',
      light: '#9a4f74',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#7a2f54',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#7a2f54',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#7a2f54',
          '&:hover': {
            color: '#8a3f64',
          },
        },
      },
    },
  },
});
