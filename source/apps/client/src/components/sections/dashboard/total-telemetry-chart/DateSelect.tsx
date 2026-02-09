import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import customShadows from 'theme/shadows';
import dayjs from 'dayjs';

const DateSelect = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={['month', 'year']}
        defaultValue={dayjs('Jan-2024')}
        format="MMM YYYY"
        sx={(theme) => ({
          boxShadow: 'none',
          '& .MuiInputBase-root': {
            p: 0,
            border: 'none',
            background: `${theme.palette.neutral.main} !important`,
            borderRadius: 1.5,
          },
          '& .MuiOutlinedInput-root': {
            pr: 1.75,
            '& .MuiOutlinedInput-notchedOutline': {
              borderWidth: 0,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderWidth: 0,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 0,
            },
          },
          '& .MuiOutlinedInput-input': {
            p: 1,
            color: 'text.secondary',
            fontSize: 'caption.fontSize',
            fontWeight: 500,
            width: 60,
          },
          '& .MuiIconButton-edgeEnd': {
            color: 'text.secondary',
            backgroundColor: 'transparent !important',
            '& .MuiSvgIcon-fontSizeMedium': {
              fontSize: 'subtitle1.fontSize',
            },
          },
        })}
        slotProps={{
          popper: {
            sx: {
              '& .MuiPaper-root': {
                p: 0,
                boxShadow: customShadows[0],
                borderRadius: 2.5,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateSelect;
