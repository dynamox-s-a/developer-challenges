import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const InputLabel: Components<Omit<Theme, 'components'>>['MuiInputLabel'] = {
  defaultProps: {
    shrink: true,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      left: 0,
      top: theme.spacing(-3.75),
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.text.primary,
      transform: 'none',
      fontWeight: 600,
    }),
  },
};

export default InputLabel;
