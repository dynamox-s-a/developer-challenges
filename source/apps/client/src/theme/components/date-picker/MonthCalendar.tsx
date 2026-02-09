import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const MonthCalendar: Components<Omit<Theme, 'components'>>['MuiMonthCalendar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiPickersMonth-root': {
        '& .MuiPickersMonth-monthButton': {
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
          },
        },
      },
    }),
  },
};

export default MonthCalendar;
