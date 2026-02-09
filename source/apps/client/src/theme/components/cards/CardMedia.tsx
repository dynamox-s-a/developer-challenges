import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const CardMedia: Components<Omit<Theme, 'components'>>['MuiCardMedia'] = {
  styleOverrides: {
    root: {},
    img: ({ theme }) => ({
      borderRadius: theme.shape.borderRadius * 2.5,
    }),
  },
};

export default CardMedia;
