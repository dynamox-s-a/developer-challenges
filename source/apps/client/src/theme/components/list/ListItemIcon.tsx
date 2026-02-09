import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const ListItemIcon: Components<Omit<Theme, 'components'>>['MuiListItemIcon'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      minWidth: '0 !important',
      marginRight: theme.spacing(1.75),
      color: theme.palette.text.disabled,
      fontSize: theme.typography.h5.fontSize,
    }),
  },
};

export default ListItemIcon;
