import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import IconifyIcon from 'components/base/IconifyIcon';

const Checkbox: Components<Omit<Theme, 'components'>>['MuiCheckbox'] = {
  defaultProps: {
    icon: <IconifyIcon icon="mdi:checkbox-blank" />,
    checkedIcon: <IconifyIcon icon="mdi:checkbox-marked" />,
    indeterminateIcon: <IconifyIcon icon="mdi:indeterminate-check-box" />,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.neutral.main,
    }),
    sizeMedium: ({ theme }) => ({
      padding: theme.spacing(0.75),
      '& .MuiBox-root': {
        fontSize: theme.typography.h5.fontSize,
      },
    }),
    sizeSmall: ({ theme }) => ({
      '& .MuiBox-root': {
        fontSize: theme.typography.h6.fontSize,
      },
    }),
  },
};

export default Checkbox;
