import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Chip: Components<Omit<Theme, 'components'>>['MuiChip'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      margin: 0,
      fontWeight: 700,
      color: theme.palette.neutral.lightest,
    }),
    sizeSmall: ({ theme }) => ({
      height: 24,
      padding: theme.spacing(0, 1),
      fontSize: theme.typography.caption.fontSize,
    }),
    sizeMedium: ({ theme }) => ({
      height: 28,
      padding: theme.spacing(0, 1.25),
      fontSize: theme.typography.body2.fontSize,
    }),
    colorPrimary: ({ theme }) => ({
      backgroundColor: theme.palette.neutral.light,
    }),
    colorSuccess: ({ theme }) => ({
      backgroundColor: theme.palette.success.main,
    }),
    colorWarning: ({ theme }) => ({
      backgroundColor: theme.palette.warning.main,
    }),
    colorError: ({ theme }) => ({
      backgroundColor: theme.palette.error.main,
    }),
    iconSmall: {
      width: 12,
      margin: '0 !important',
    },
    iconMedium: {
      width: 16,
      margin: '0 !important',
    },
    labelSmall: {
      padding: 0,
      textTransform: 'capitalize',
    },
    labelMedium: {
      padding: 0,
      textTransform: 'capitalize',
    },
  },
};

export default Chip;
