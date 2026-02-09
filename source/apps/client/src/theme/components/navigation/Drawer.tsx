import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Drawer: Components<Omit<Theme, 'components'>>['MuiDrawer'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
      '*::-webkit-scrollbar-track': {
        marginTop: theme.spacing(15),
      },
    }),
    paper: ({ theme }) => ({
      padding: 0,
      width: '290px',
      height: '100vh',
      border: 0,
      borderRadius: 0,
      backgroundColor: theme.palette.neutral.lightest,
      boxShadow: 'none',
      boxSizing: 'border-box',
    }),
  },
};

export default Drawer;
