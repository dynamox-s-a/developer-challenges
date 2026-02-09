import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconifyIcon from 'components/base/IconifyIcon';
import { AppDispatch, RootState } from 'store/store';
import { fetchTotalTelemetry, fetchTelemetryTrend, updateStats } from 'store/slices/statsSlice';
import { socket } from 'utils/socket';
import DateSelect from './DateSelect';
import TelemetryTrendChart from './TelemetryTrendChart';

const TotalTelemetryChart = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { totalTelemetry, telemetryTrend } = useSelector((state: RootState) => state.stats);

  useEffect(() => {
    dispatch(fetchTotalTelemetry());
    dispatch(fetchTelemetryTrend());

    const trendInterval = setInterval(() => {
      dispatch(fetchTelemetryTrend());
    }, 30000); // 30 seconds

    const onTelemetryCountUpdate = (data: any) => {
      dispatch(updateStats(data));
    };

    socket.on('telemetry_count_update', onTelemetryCountUpdate);

    return () => {
      clearInterval(trendInterval);
      socket.off('telemetry_count_update', onTelemetryCountUpdate);
    };
  }, [dispatch]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const chartSeries = [
    { name: 'Acc (m/s²)', data: telemetryTrend.acceleration, color: theme.palette.primary.main },
    { name: 'Vel (mm/s)', data: telemetryTrend.velocity, color: theme.palette.secondary.main },
    { name: 'Temp (°C)', data: telemetryTrend.temperature, color: theme.palette.warning.main },
  ];

  return (
    <Box component={Paper} pt={2.5} px={3} pb={1} height={{ xs: 450, sm: 350 }}>
      <Stack justifyContent="space-between">
        <Typography mt={0.35} variant="h4" color="text.primary">
          Avarage Telemetry Trend
        </Typography>
        {/* <DateSelect />

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
        </Stack> */}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} mt={1.75}>
        {/* <Box minWidth={150}>
          <Typography mt={0.35} variant="h2" color="text.primary">
            {formatNumber(totalTelemetry)}
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
                Live
              </Typography>
            </Stack>
          </Stack>
          <Stack mt={2} alignItems="center" spacing={0.5}>
            <IconifyIcon icon="ic:round-check-circle" color="success.main" fontSize="h6.fontSize" />
            <Typography variant="body1" color="success.main" fontWeight={700}>
              System Healthy
            </Typography>
          </Stack>
        </Box> */}

        <TelemetryTrendChart 
          categories={telemetryTrend.timestamps} 
          series={chartSeries} 
          sx={{ width: 1, height: '235px !important' }} 
        />
      </Stack>
    </Box>
  );
};

export default TotalTelemetryChart;
