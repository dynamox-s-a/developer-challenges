import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconifyIcon from 'components/base/IconifyIcon';
import DailyTrafficChart from './DailyTrafficChart';

const DailyTraffic = () => {
  return (
    <Paper sx={{ height: 350 }}>
      <Stack alignItems="flex-start" justifyContent="space-between">
        <div>
          <Typography variant="body2" color="text.disabled" fontWeight={500}>
            Daily Traffic
          </Typography>
          <Typography mt={0.5} variant="h2">
            2.579{' '}
            <Typography component="span" variant="body2" color="text.disabled" fontWeight={500}>
              Visitors
            </Typography>
          </Typography>
        </div>
        <Stack alignItems="center" spacing={0.25}>
          <IconifyIcon
            icon="ic:baseline-arrow-drop-up"
            color="success.main"
            fontSize="h6.fontSize"
          />
          <Typography variant="body2" color="success.main" fontWeight={700}>
            +2.45%
          </Typography>
        </Stack>
      </Stack>

      <DailyTrafficChart
        data={[110, 80, 150, 100, 130, 160, 60]}
        sx={{ height: '230px !important' }}
      />
    </Paper>
  );
};

export default DailyTraffic;
