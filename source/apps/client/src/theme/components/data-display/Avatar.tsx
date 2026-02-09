import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Avatar: Components<Omit<Theme, 'components'>>['MuiAvatar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.neutral.lighter,
      backgroundColor: theme.palette.primary.main,
    }),
  },
};

export default Avatar;
