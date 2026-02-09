import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const IconButton: Components<Omit<Theme, 'components'>>['MuiIconButton'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.neutral.darker,
      marginLeft: 0,
    }),
    colorError: ({ theme }) => ({
      backgroundColor: theme.palette.error.main,
      color: theme.palette.neutral.lightest,
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
      '&:active': {
        backgroundColor: theme.palette.error.darker,
      },
    }),
    sizeLarge: ({ theme }) => ({
      padding: theme.spacing(1),
      fontSize: theme.typography.h3.fontSize,
    }),
    sizeMedium: ({ theme }) => ({
      padding: theme.spacing(0.75),
      fontSize: theme.typography.h4.fontSize,
    }),
    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(0.5),
      fontSize: theme.typography.h6.fontSize,
    }),
  },
};

export default IconButton;
