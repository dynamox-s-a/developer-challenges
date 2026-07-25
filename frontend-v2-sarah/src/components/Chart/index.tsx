import { useMemo, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import { Typography, useTheme } from '@mui/material';
import type { ChartData } from '../../features/data/types';
import {
  ChartContainer,
  ChartContent,
  ChartWrapperHeader,
  ChartWrapper,
} from './style';
import { adaptChartDataToHighcharts } from './chartAdapter';

export const Chart = ({ data }: { data: ChartData }) => {
  const { chartTitle } = data;
  const theme = useTheme();
  const lineColor = theme.palette.grey[500];
  const bodyFontConfig = theme.typography.body2;
  const legendFontConfig = theme.typography.chartLegend;
  const chartContentRef = useRef<HTMLDivElement>(null);
  const chartOptions = useMemo(
    () =>
      adaptChartDataToHighcharts(
        data,
        lineColor,
        bodyFontConfig,
        legendFontConfig,
      ),
    [data, lineColor, bodyFontConfig, legendFontConfig],
  );

  useEffect(() => {
    if (chartContentRef.current)
      Highcharts.chart(chartContentRef.current, chartOptions);
  }, [chartOptions]);

  return (
    <ChartWrapper>
      <ChartWrapperHeader>
        <Typography variant="h6">{chartTitle}</Typography>
      </ChartWrapperHeader>
      <ChartContainer>
        <ChartContent ref={chartContentRef}></ChartContent>
      </ChartContainer>
    </ChartWrapper>
  );
};
