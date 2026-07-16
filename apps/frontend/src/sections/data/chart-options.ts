import type { Series } from '@repo/contracts';
import type Highcharts from 'highcharts';

import type { MetricGroup } from 'src/store/measurements/selectors';

export const AXIS_COLORS: Record<string, string> = {
  x: '#00A76F',
  y: '#FFAB00',
  z: '#8E33FF',
  scalar: '#00B8D9',
};

const PLOT_MARGIN_LEFT = 64;

export const seriesLabel = (series: Series): string =>
  series.axis ? `Eixo ${series.axis.toUpperCase()}` : 'Leitura';

export const seriesColor = (series: Series): string => AXIS_COLORS[series.axis ?? 'scalar'];

export type ChartPalette = {
  text: string;
  subtext: string;
  divider: string;
  tooltipBg: string;
  buttonText: string;
  buttonBg: string;
  buttonHoverBg: string;
};

export const toChartData = (series: Series): [number, number][] =>
  series.points
    .map((point): [number, number] => [new Date(point.datetime).getTime(), point.max])
    .filter(([timestamp]) => !Number.isNaN(timestamp));

export const buildChartOptions = (group: MetricGroup, palette: ChartPalette): Highcharts.Options => {
  const decimals = group.metric === 'acceleration' ? 4 : 2;

  return {
    chart: {
      height: 280,
      backgroundColor: 'transparent',
      zooming: { type: 'x' },
      marginLeft: PLOT_MARGIN_LEFT,
      marginRight: 24,
      style: { fontFamily: 'inherit' },
      resetZoomButton: {
        position: { align: 'right', x: -4, y: 4 },
        theme: {
          fill: palette.buttonBg,
          stroke: 'none',
          r: 8,
          padding: 6,
          style: { color: palette.buttonText, fontWeight: '700', fontSize: '12px' },
          states: {
            hover: {
              fill: palette.buttonHoverBg,
              style: { color: palette.buttonText },
            },
          },
        },
      },
    },
    title: { text: undefined },
    credits: { enabled: false },
    accessibility: { description: `Série temporal de ${group.label} em ${group.unit}` },
    xAxis: {
      type: 'datetime',
      crosshair: { width: 1, dashStyle: 'Dash', color: palette.subtext },
      lineColor: palette.divider,
      tickColor: palette.divider,
      labels: { style: { color: palette.subtext } },
    },
    yAxis: {
      title: { text: group.unit, style: { color: palette.subtext } },
      gridLineColor: palette.divider,
      labels: { style: { color: palette.subtext } },
      startOnTick: false,
      endOnTick: false,
    },
    tooltip: {
      shared: true,
      backgroundColor: palette.tooltipBg,
      borderWidth: 0,
      shadow: true,
      style: { color: palette.text },
      valueSuffix: ` ${group.unit}`,
      valueDecimals: decimals,
      xDateFormat: '%d/%m/%Y %H:%M',
    },
    legend: {
      enabled: group.series.length > 1,
      itemStyle: { color: palette.subtext },
      itemHoverStyle: { color: palette.text },
    },
    plotOptions: {
      series: {
        marker: { enabled: false, symbol: 'circle', states: { hover: { radius: 4 } } },
        states: { inactive: { opacity: 1 } },
      },
    },
    series: group.series.map((series) => ({
      type: 'line',
      id: series.id,
      name: seriesLabel(series),
      color: seriesColor(series),
      data: toChartData(series),
    })),
  };
};
