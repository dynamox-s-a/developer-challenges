import React, { useState, useRef } from 'react';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { PiChartDataProps } from 'data/piChartData';
import { PiChartData } from 'data/piChartData';
import customShadows from 'theme/shadows';
import PiChart from './PiChart';

const YourPiChart = () => {
  const [timeline, setTimeline] = useState('monthly');
  const [chartData, setChartData] = useState(PiChartData);
  const chartRef = useRef<EChartsReactCore>(null);
  const theme = useTheme();

  const handleSelectChange = (event: SelectChangeEvent) => {
    setTimeline(event.target.value);
  };

  const toggleVisibility = (name: string) => {
    const updatedData = chartData.map((item) =>
      item.name === name ? { ...item, visible: !item.visible } : item,
    );
    setChartData(updatedData);
    updateChart(updatedData);
  };

  const updateChart = (data: PiChartDataProps[]) => {
    const echartsInstance = chartRef.current?.getEchartsInstance();
    if (!echartsInstance) return;

    const visibleData = data
      .filter((item) => item.visible)
      .map((item) => ({
        value: item.value,
        name: item.name,
        itemStyle: {
          color:
            item.id === 1
              ? theme.palette.primary.main
              : item.id === 2
                ? theme.palette.secondary.main
                : theme.palette.warning.main,
        },
      }));

    echartsInstance.setOption({
      series: [
        {
          data: visibleData,
        },
      ],
    });
  };

  return (
    <Paper sx={{ py: 2.5, height: 350 }}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="body1" fontWeight={700}>
          Sensor Distribution
        </Typography>

        <FormControl
          variant="filled"
          sx={{
            minWidth: 110,
            '& .MuiInputBase-root': {
              '&:focus-within': {
                borderColor: 'transparent !important',
                boxShadow: 'none',
              },
            },
          }}
        >
          <Select id="select-filled" value={timeline} onChange={handleSelectChange}>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <PiChart chartRef={chartRef} sx={{ height: '180px !important' }} />

      <Stack px={2} py={1} alignItems="center" borderRadius={4} boxShadow={customShadows[1]}>
        {chartData.map((item) => (
          <React.Fragment key={item.id}>
            <Stack
              component={ButtonBase}
              width="33%"
              mt={0.75}
              spacing={0.75}
              alignItems="flex-start"
              justifyContent="center"
              onClick={() => toggleVisibility(item.name)}
              disableRipple
            >
              <Box
                height={10}
                width={10}
                borderRadius="50%"
                bgcolor={
                  item.visible
                    ? item.id === 1
                      ? 'primary.main'
                      : item.id === 2
                        ? 'secondary.main'
                        : 'warning.main'
                    : 'neutral.light'
                }
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
            {item.id !== 3 && (
              <Divider sx={{ height: 50 }} orientation="vertical" variant="middle" flexItem />
            )}
          </React.Fragment>
        ))}
      </Stack>
    </Paper>
  );
};

export default YourPiChart;
