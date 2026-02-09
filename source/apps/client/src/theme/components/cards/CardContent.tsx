import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const CardContent: Components<Omit<Theme, 'components'>>['MuiCardContent'] = {
  styleOverrides: {
    root: {
      padding: 0,
      '&:last-child': {
        paddingBottom: 0,
      },
    },
  },
};

export default CardContent;
