import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const InputBase: Components<Omit<Theme, 'components'>>['MuiInputBase'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      border: 1,
      borderStyle: 'solid',
      borderColor: theme.palette.neutral.main,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: `${theme.palette.neutral.lighter} !important`,
      fontSize: theme.typography.subtitle2.fontSize,
      color: theme.palette.text.primary,
      padding: theme.spacing(1.45, 2),
      letterSpacing: 0.5,

      '&:focus-within': {
        borderColor: theme.palette.primary.main,
      },

      '&:before, &:after': {
        display: 'none',
      },
    }),
    colorSecondary: ({ theme }) => ({
      backgroundColor: `${theme.palette.neutral.dark} !important`,
    }),
    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(1, 1.25),
      paddingLeft: `${theme.spacing(1.75)} !important`,
      fontSize: theme.typography.caption.fontSize,
    }),
    input: ({ theme }) => ({
      '&::placeholder': {
        color: theme.palette.text.disabled,
        opacity: 1,
      },
    }),
    inputSizeSmall: ({ theme }) => ({
      marginBottom: theme.spacing(0.2),
    }),
  },
};

export default InputBase;
