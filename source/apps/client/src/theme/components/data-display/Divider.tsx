import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Divider: Components<Omit<Theme, 'components'>>['MuiDivider'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      height: 2,
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderColor: theme.palette.neutral.main,

      '&.MuiDivider-withChildren': {
        height: '0 !important',
        color: theme.palette.text.disabled,
        backgroundColor: 'transparent',
        fontWeight: 500,

        '&::before': {
          backgroundColor: theme.palette.neutral.main,
        },
        '&::after': {
          backgroundColor: theme.palette.neutral.main,
        },
      },
    }),
  },
};

export default Divider;
