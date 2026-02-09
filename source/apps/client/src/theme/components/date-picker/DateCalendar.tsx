import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';

const DateCalendar: Components<Omit<Theme, 'components'>>['MuiDateCalendar'] = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiDayCalendar-header': {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        placeItems: 'center',
        gap: 0,

        '& .MuiDayCalendar-weekDayLabel': {
          color: theme.palette.text.primary,
          fontSize: theme.typography.body2.fontSize,
          fontWeight: 700,
        },
      },
      '& .MuiPickersSlideTransition-root': {
        '& .MuiDayCalendar-monthContainer': {
          '& .MuiDayCalendar-weekContainer': {
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            placeItems: 'center',
            gap: 0,

            '& .MuiPickersDay-root': {
              margin: 0,
            },
            '& .MuiPickersDay-today': {
              border: 'none',
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.neutral.main,
            },
            '& .MuiPickersDay-today.Mui-selected': {
              color: theme.palette.neutral.lighter,
              backgroundColor: theme.palette.primary.main,
            },
          },
        },
      },
    }),
  },
};

export default DateCalendar;
