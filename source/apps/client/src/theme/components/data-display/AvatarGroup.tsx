import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const AvatarGroup: Components<Omit<Theme, 'components'>>['MuiAvatarGroup'] = {
  styleOverrides: {
    root: {},
    avatar: ({ theme }) => ({
      border: 3,
      marginLeft: theme.spacing(-2),
      borderStyle: 'solid',
      borderColor: theme.palette.neutral.lighter,
      fontSize: theme.typography.body2.fontSize,
      '&:nth-of-type(1)': {
        zIndex: 99,
        backgroundColor: theme.palette.neutral.dark,
      },
    }),
  },
};

export default AvatarGroup;
