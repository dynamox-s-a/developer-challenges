import { spentChartData } from 'data/spentChartData';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconifyIcon from 'components/base/IconifyIcon';
import DateSelect from './DateSelect';
import SpentChart from './SpentChart';

const TotalSpent = () => {
  return (
    <Box component={Paper} height={{ xs: 450, sm: 350 }}>
      <Stack justifyContent="space-between">
        <DateSelect />

        <Stack
          component={ButtonBase}
          alignItems="center"
          justifyContent="center"
          height={36}
          width={36}
          bgcolor="neutral.main"
          borderRadius={2.5}
        >
          <IconifyIcon icon="ic:round-insights" color="primary.main" fontSize="h4.fontSize" />
        </Stack>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} mt={1.75}>
        <Box minWidth={150}>
          <Typography mt={0.35} variant="h2" color="text.primary">
            1.2M
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.disabled" fontWeight={500}>
              Total Telemetry
            </Typography>

            <Stack alignItems="center" spacing={0.25}>
              <IconifyIcon
                icon="ic:baseline-arrow-drop-up"
                color="success.main"
                fontSize="h6.fontSize"
              />
              <Typography variant="caption" color="success.main" fontWeight={700}>
                +12.5%
              </Typography>
            </Stack>
          </Stack>
          <Stack mt={2} alignItems="center" spacing={0.5}>
            <IconifyIcon icon="ic:round-check-circle" color="success.main" fontSize="h6.fontSize" />
            <Typography variant="body1" color="success.main" fontWeight={700}>
              System Healthy
            </Typography>
          </Stack>
        </Box>

        <SpentChart data={spentChartData} sx={{ width: 1, height: '235px !important' }} />
      </Stack>
    </Box>
  );
};

export default TotalSpent;
