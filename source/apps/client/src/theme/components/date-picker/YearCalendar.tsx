import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const YearCalendar: Components<Omit<Theme, 'components'>>['MuiYearCalendar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiPickersYear-root': {
        '& .MuiPickersYear-yearButton': {
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
          },
        },
      },
    }),
  },
};

export default YearCalendar;
