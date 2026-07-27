import { createTheme } from '@mui/material';
import {
  ChartTitle,
  YAxisTitle,
  type ChartData,
} from '../../features/data/types';

export const mockChartData: ChartData = {
  category: 'gráfico',
  chartTitle: ChartTitle.ACCELERATION,
  yAxisTitle: YAxisTitle.ACCELERATION,
  unit: 'g',
  series: [
    {
      id: '1',
      name: 'accelleration',
      label: 'Série A',
      color: '#e8de14',
      data: [
        [1625097600000, 10],
        [1625184000000, 20],
      ],
    },
  ],
};

export const theme = createTheme({
  typography: {
    chartLegend: {
      fontFamily: 'Roboto, sans-serif',
      fontWeight: 700,
      fontSize: '1rem',
      lineHeight: '1.2',
      color: '#3A3B3F',
    },
  },
});
