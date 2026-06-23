// src/components/SensorChart/index.tsx
import React from 'react';
import * as Highcharts from 'highcharts'; // ← Importação nomeada com *
import { HighchartsReact } from 'highcharts-react-official'; // ← Importação nomeada
import type { SensorDataPoint } from '../../types/sensor.types';

interface SensorChartProps {
  title: string;
  series: {
    name: string;
    data: SensorDataPoint[];
    color?: string;
  }[];
  colors?: string[];
}

const SensorChart: React.FC<SensorChartProps> = ({ title, series, colors }) => {
  const formattedSeries = series.map((s, index) => ({
    name: s.name,
    data: s.data.map((point) => [new Date(point.datetime).getTime(), point.max]),
    color: colors?.[index] || undefined,
    type: 'line' as const,
  }));

  const options: Highcharts.Options = {
    chart: {
      zoomType: 'x',
      height: 280,
      backgroundColor: 'transparent',
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      labels: {
        format: '{value:%b %e}',
      },
      crosshair: {
        width: 2,
        color: '#888',
        dashStyle: 'Dash',
        zIndex: 10,
      },
    },
    yAxis: {
      title: {
        text: '',
      },
      gridLineColor: '#e0e0e0',
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueDecimals: 4,
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
    },
    series: formattedSeries as Highcharts.SeriesOptionsType[],
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          radius: 3,
        },
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default SensorChart;