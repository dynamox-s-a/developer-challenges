import { revenueChartData } from 'data/revenueChartData';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconifyIcon from 'components/base/IconifyIcon';
import RevenueChart from './RevenueChart';

const Revenue = () => {
  return (
    <Box component={Paper} height={350}>
      <Stack justifyContent="space-between">
        <Typography variant="h4">Machine Activity</Typography>
        <Stack
          component={ButtonBase}
          alignItems="center"
          justifyContent="center"
          height={36}
          width={36}
          bgcolor="neutral.main"
          borderRadius={2.5}
        >
          <IconifyIcon icon="ic:round-bar-chart" color="primary.main" fontSize="h4.fontSize" />
        </Stack>
      </Stack>

      <RevenueChart data={revenueChartData} sx={{ height: '265px !important' }} />
    </Box>
  );
};

export default Revenue;
