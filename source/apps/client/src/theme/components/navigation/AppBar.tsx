import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const AppBar: Components<Omit<Theme, 'components'>>['MuiAppBar'] = {
  styleOverrides: {
    colorPrimary: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      boxShadow: 'none',
    },
  },
};

export default AppBar;
