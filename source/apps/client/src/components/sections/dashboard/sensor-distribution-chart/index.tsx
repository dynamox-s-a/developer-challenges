import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { AppDispatch, RootState } from 'store/store';
import { fetchSensorsDistribution, updateSensorsDistribution } from 'store/slices/statsSlice';
import { socket } from 'utils/socket';
import customShadows from 'theme/shadows';
import PiChart from './PiChart';

const SensorDistributionChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sensorsDistribution } = useSelector((state: RootState) => state.stats);
  const chartRef = useRef<EChartsReactCore>(null);
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchSensorsDistribution());

    const onDistributionUpdate = (data: any) => {
      dispatch(updateSensorsDistribution(data));
    };

    socket.on('sensors_distribution_update', onDistributionUpdate);

    return () => {
      socket.off('sensors_distribution_update', onDistributionUpdate);
    };
  }, [dispatch]);

  const chartData = [
    { id: 1, value: sensorsDistribution?.TcAg, name: 'TcAg', color: theme.palette.primary.main },
    { id: 2, value: sensorsDistribution?.TcAs, name: 'TcAs', color: theme.palette.secondary.main },
    { id: 3, value: sensorsDistribution?.HF_Plus, name: 'HF+', color: theme.palette.warning.main },
  ];

  useEffect(() => {
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    echartsInstance.setOption({
      series: [
        {
          data: chartData.map(item => ({
            value: item.value,
            name: item.name,
            itemStyle: { color: item.color }
          })),
        },
      ],
    });
  }, [sensorsDistribution, theme]);

  return (
    <Paper sx={{ py: 2.5, height: 350 }}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography mt={0.35} variant="h4" color="text.primary">
          Sensor Distribution
        </Typography>
      </Stack>

      <PiChart chartRef={chartRef} sx={{ height: '180px !important' }} />

      <Stack px={2} py={1} alignItems="center" borderRadius={4} boxShadow={customShadows[1]}>
        {chartData.map((item, index) => (
          <React.Fragment key={item.id}>
            <Stack
              component={ButtonBase}
              width="33%"
              mt={0.75}
              spacing={0.75}
              alignItems="flex-start"
              justifyContent="center"
              disableRipple
            >
              <Box
                height={10}
                width={10}
                borderRadius="50%"
                bgcolor={item.color}
              />
              <Box mt={-0.55}>
                <Typography variant="caption" color="text.disabled">
                  {item.name}
                </Typography>
                <Typography variant="h6" textAlign="left">
                  {item.value}%
                </Typography>
              </Box>
            </Stack>
            {index !== chartData.length - 1 && (
              <Divider sx={{ height: 50 }} orientation="vertical" variant="middle" flexItem />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Paper>
  );
};

export default SensorDistributionChart;
