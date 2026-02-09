import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const Select: Components<Omit<Theme, 'components'>>['MuiSelect'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(0, 1.25),
      borderRadius: theme.shape.borderRadius * 4.5,
      '&.MuiInputBase-root': {
        border: 'none',
        '& .MuiBox-root': {
          minWidth: 20,
        },
      },
    }),
    select: ({ theme }) => ({
      padding: theme.spacing(1),
      paddingRight: '0 !important',
      backgroundColor: 'transparent !important',
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.text.primary,
      fontWeight: 600,
      border: 'none',
    }),
    icon: ({ theme }) => ({
      color: theme.palette.text.disabled,
    }),
  },
};

export default Select;
