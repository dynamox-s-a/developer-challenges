import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { fetchTotalTelemetry, fetchTelemetryTrend, updateStats } from 'store/slices/statsSlice';
import { socket } from 'utils/socket';
import TelemetryTrendChart from './TelemetryTrendChart';
import { AppDispatch, RootState } from 'store/store';

const TotalTelemetryChart = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { telemetryTrend, status, error } = useSelector((state: RootState) => state.stats);

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
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} mt={1.75}>
        <TelemetryTrendChart 
          categories={telemetryTrend.timestamps} 
          series={chartSeries} 
          loading={status === 'loading'}
          error={status === 'failed' ? error : null}
          sx={{ width: 1, height: '235px !important' }} 
        />
      </Stack>
    </Box>
  );
};

export default TotalTelemetryChart;
