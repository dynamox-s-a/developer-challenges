import React, { useEffect, useRef } from 'react';
import * as Highcharts from 'highcharts';
import { HighchartsReact } from 'highcharts-react-official';
import type { SensorDataPoint } from '../../types/sensor.types';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';

interface SensorChartProps {
  title: string;
  series: {
    name: string;
    data: SensorDataPoint[];
    color?: string;
  }[];
  hoveredTimestamp?: number | null;
  onHover?: (timestamp: number | null) => void;
  yAxisTitle?: string;
}

const SensorChart: React.FC<SensorChartProps> = ({
  title,
  series,
  hoveredTimestamp,
  onHover,
  yAxisTitle = '',
}) => {
  const chartRef = useRef<HighchartsReact>(null);
  const theme = useTheme();

  if (series.some((s) => s.data.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
        <Typography color="textSecondary">Sem dados disponíveis</Typography>
      </Box>
    );
  }

  const firstSeries = series.find((s) => s.data.length > 0);
  const dataPoints = firstSeries?.data || [];

  let tickInterval: number | undefined = undefined;
  if (dataPoints.length >= 2) {
    const timestamps = dataPoints.map((p) => new Date(p.datetime).getTime());
    const intervals = [];
    for (let i = 1; i < timestamps.length; i++) {
      intervals.push(timestamps[i] - timestamps[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    tickInterval = avgInterval * 2;
  }

  const formattedSeries = series.map((s) => ({
    name: s.name,
    data: s.data.map((point) => [new Date(point.datetime).getTime(), point.max]),
    color: s.color || undefined,
    type: 'line' as const,
  }));

  const options: Highcharts.Options = {
    chart: {
      zoomType: 'x',
      height: 430,
      backgroundColor: 'transparent',
      plotBorderWidth: 1,
      plotBorderColor: theme.palette.divider,
    },
    title: {
      text: '',
    },
    xAxis: {
      type: 'datetime',
      tickInterval: 2 * 24 * 3600 * 1000,
      labels: {
        format: '{value:%d. %b}',
        style: {
          color: '#6673A9',
          fontSize: '12px',
          fontFamily: 'roboto',
          fontWeight: '400'
        },
      },
      lineColor: 'transparent',
      tickColor: 'transparent',
      gridLineWidth: 1,
      gridLineColor: theme.palette.divider,
      gridLineDashStyle: 'Solid',
      crosshair: {
        width: 2,
        color: theme.palette.text.disabled,
        dashStyle: 'Dash',
        zIndex: 10,
      },
    },
    yAxis: {
      title: {
        text: yAxisTitle,
        style: {
          color: '#6673A9',
          fontSize: '12px',
          fontFamily: 'roboto',
          fontWeight: '400'
        },
      },
      gridLineColor: theme.palette.divider,
      gridLineWidth: 1,
      labels: {
        style: {
          color: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      valueDecimals: 4,
      xDateFormat: '%Y-%m-%d %H:%M:%S',
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      style: {
        color: theme.palette.text.primary,
      },
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      y: 20,
      itemMarginTop: 24,
      itemStyle: {
        color: '#5B5F65',
        fontWeight: '700',
        fontFamily: 'roboto',
        fontSize: '12px'
      },
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

  useEffect(() => {
    const handleResize = () => {
      const chart = chartRef.current?.chart;
      if (chart) {
        chart.reflow();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <HighchartsReact highcharts={Highcharts} options={options} ref={chartRef} />;
};

export default SensorChart;