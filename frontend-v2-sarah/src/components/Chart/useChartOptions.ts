import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import type { ChartData } from '../../features/data/types';
import { adaptChartDataToHighcharts } from './chartAdapter';

export const useChartOptions = (data: ChartData) => {
  const theme = useTheme();

  return useMemo(() => {
    const chartStyleConfig = {
      lineColor: theme.palette.grey[500],
      bodyFontConfig: theme.typography.body2,
      legendFontConfig: theme.typography.chartLegend,
    };
    return adaptChartDataToHighcharts({ data, chartStyleConfig });
  }, [data, theme]);
};
