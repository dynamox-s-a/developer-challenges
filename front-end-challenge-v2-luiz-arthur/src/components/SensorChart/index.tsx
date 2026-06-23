// src/components/SensorChart/index.tsx
import React, { useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import type { SensorDataPoint } from '../../types/sensor.types';

interface SensorChartProps {
  title: string;
  series: {
    name: string;
    data: SensorDataPoint[];
    color?: string;
  }[];
  colors?: string[];
  hoveredTimestamp?: number | null;
  onHover?: (timestamp: number | null) => void;
}

const SensorChart: React.FC<SensorChartProps> = ({
  title,
  series,
  colors,
  hoveredTimestamp,
  onHover,
}) => {
  const chartRef = useRef<HighchartsReact>(null);

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
      events: {
        // Adiciona evento para capturar mouse sobre o gráfico como fallback
        mouseOver: () => {
          // Não usado diretamente
        },
      },
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
      xDateFormat: '%Y-%m-%d %H:%M:%S',
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
        events: {
          mouseOver: function (e) {
            if (e.target?.x && onHover) {
              const timestamp = e.target.x;
              onHover(timestamp);
            }
          },
          mouseOut: function () {
            if (onHover) {
              onHover(null);
            }
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: false,
    },
  };

  useEffect(() => {
    const chart = chartRef.current?.chart;
    if (!chart) return;

    const xAxis = chart.xAxis[0];
    if (!xAxis) return;

    if (hoveredTimestamp !== null && hoveredTimestamp !== undefined) {
      xAxis.drawCrosshair(null, { x: hoveredTimestamp } as any);
      const seriesList = chart.series;
      if (seriesList.length > 0) {
        const points = seriesList
          .map((s) => s.findNearestPointByX(hoveredTimestamp))
          .filter(Boolean);
        if (points.length > 0) {
          chart.tooltip.refresh(points);
        }
      }
    } else {
      xAxis.hideCrosshair();
      if (chart.tooltip) {
        chart.tooltip.hide();
      }
    }
  }, [hoveredTimestamp]);

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />;
};

export default SensorChart;