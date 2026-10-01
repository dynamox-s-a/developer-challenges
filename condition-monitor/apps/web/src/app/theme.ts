import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1f4e79' },
    secondary: { main: '#2e7d32' },
    background: { default: '#f5f7fa' },
  },
  shape: { borderRadius: 8 },
});
