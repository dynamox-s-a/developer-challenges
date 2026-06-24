import { useMemo, type ComponentType, type CSSProperties } from 'react'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { useTheme, type Theme } from '@mui/material/styles'
import Highcharts from 'highcharts'
import 'highcharts/modules/accessibility'
import HighchartsReactModule from 'highcharts-react-official'
import type { IMeasurementSeries } from '../../../../modules/measurements/types'

Highcharts.setOptions({
  lang: {
    shortMonths: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
  },
})

export interface MetricConfig {
  seriesKey: string
  title: string
  yAxisTitle: string
}

interface MetricChartPanelProps {
  metric: MetricConfig
  series: IMeasurementSeries[]
}

interface HighchartsReactProps {
  containerProps?: {
    style?: CSSProperties
  }
  highcharts: typeof Highcharts
  options: Highcharts.Options
}

const highchartsReactExport = HighchartsReactModule as unknown as {
  default?: ComponentType<HighchartsReactProps>
  HighchartsReact?: ComponentType<HighchartsReactProps>
}

const HighchartsReact =
  highchartsReactExport.default ??
  highchartsReactExport.HighchartsReact ??
  (HighchartsReactModule as ComponentType<HighchartsReactProps>)

const axisLabels: Record<string, string> = {
  x: 'Axial',
  y: 'Horizontal',
  z: 'Radial',
}

const axisColors: Record<string, string> = {
  x: '#2386CB',
  y: '#CC337D',
  z: '#B48A00',
  temperature: '#89982E',
}

function getAxisName(seriesName: string) {
  if (seriesName === 'temperature') {
    return 'Temperatura'
  }

  const axis = seriesName.split('/').at(-1) ?? seriesName

  return axisLabels[axis] ?? axis
}

function getSeriesColor(seriesName: string) {
  if (seriesName === 'temperature') {
    return axisColors.temperature
  }

  const axis = seriesName.split('/').at(-1) ?? seriesName

  return axisColors[axis] ?? '#3A3B3F'
}

function filterSeriesByMetric(series: IMeasurementSeries[], metricKey: string) {
  return series.filter((item) => item.name.startsWith(metricKey))
}

function toChartSeries(series: IMeasurementSeries[]) {
  return series.map((item) => ({
    color: getSeriesColor(item.name),
    data: item.data.map((point) => [
      new Date(point.datetime).getTime(),
      point.max,
    ]),
    name: getAxisName(item.name),
    type: 'line' as const,
  }))
}

function getDateAxisConfig(series: IMeasurementSeries[]) {
  const timestamps = series.flatMap((item) =>
    item.data.map((point) => new Date(point.datetime).getTime()),
  )

  if (timestamps.length === 0) {
    return undefined
  }

  const firstTimestamp = Math.min(...timestamps)
  const lastTimestamp = Math.max(...timestamps)
  const gridColumnCount = 5
  const interval = (lastTimestamp - firstTimestamp) / gridColumnCount

  return {
    gridLines: Array.from({ length: gridColumnCount - 1 }, (_, index) =>
      Math.round(firstTimestamp + interval * (index + 1)),
    ),
    max: lastTimestamp,
    min: firstTimestamp,
  }
}

function createChartOptions(
  metric: MetricConfig,
  series: IMeasurementSeries[],
  theme: Theme,
): Highcharts.Options {
  const body2ChartStyle = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.body2.fontSize,
    fontWeight: String(theme.typography.body2.fontWeight),
  }
  const legendChartStyle = {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.chartLegend.fontSize,
    fontWeight: String(theme.typography.chartLegend.fontWeight),
    letterSpacing: theme.typography.chartLegend.letterSpacing,
    lineHeight: theme.typography.chartLegend.lineHeight,
  }
  const dateAxisConfig = getDateAxisConfig(series)

  return {
    chart: {
      backgroundColor: theme.palette.background.paper,
      plotBorderWidth: 1,
      plotBorderColor: theme.border.default,
      style: {
        fontFamily: theme.typography.fontFamily,
      },
      type: 'line',
    },
    credits: {
      enabled: false,
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      margin: 24,
      itemStyle: {
        ...legendChartStyle,
        color: theme.palette.text.primary,
      },
      symbolHeight: 2,
      symbolWidth: 16,
    },
    plotOptions: {
      line: {
        lineWidth: 2,
        states: {
          hover: {
            lineWidthPlus: 0,
          },
        },
      },
      series: {
        animation: false,
        marker: {
          lineWidth: 0,
          radius: 3,
          symbol: 'circle',
          enabled: false,
        },
        states: {
          hover: {
            marker: {
              enabled: true,
            },
          },
        },
      },
    },
    series: toChartSeries(series),
    title: {
      text: undefined,
    },
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.border.default,
      borderRadius: theme.shape.borderRadius,
      headerFormat: '{point.key:%e. %b. %Y - %H:%M}<br/>',
      pointFormat:
        '<span style="color:{series.color}">&#9679;</span> {series.name}: {point.y:.2f}<br/>',
      style: {
        color: theme.palette.primary.main,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.body1.fontSize,
        fontWeight: String(theme.typography.body1.fontWeight),
      },
      shared: true,
    },
    xAxis: {
      crosshair: {
        color: '#9aa7b5',
        width: 1,
      },
      startOnTick: false,
      endOnTick: false,
      labels: {
        formatter() {
          return Highcharts.dateFormat('%e. %b', Number(this.value))
        },
        style: {
          ...body2ChartStyle,
          color: theme.chart.textColor,
        },
      },
      lineColor: theme.border.default,
      max: dateAxisConfig?.max,
      min: dateAxisConfig?.min,
      plotLines: dateAxisConfig?.gridLines.map((value) => ({
        color: theme.border.default,
        value,
        width: 1,
      })),
      tickLength: 0,
      tickWidth: 0,
      type: 'datetime',
    },
    yAxis: {
      startOnTick: true,
      endOnTick: true,
      gridLineColor: theme.border.default,
      labels: {
        formatter() {
          const value = Number(this.value)

          if (Number.isInteger(value)) {
            return String(value)
          }

          return value.toFixed(2)
        },
        style: {
          ...body2ChartStyle,
          color: theme.chart.textColor,
        },
        x: -10,
      },
      lineColor: theme.border.default,
      maxPadding: 0,
      min: 0,
      tickAmount: 5,
      title: {
        margin: 8,
        text: metric.yAxisTitle,
        y: -36,
        style: {
          ...body2ChartStyle,
          color: theme.chart.textColor,
        },
      },
    },
  }
}

export function MetricChartPanel({ metric, series }: MetricChartPanelProps) {
  const theme = useTheme()
  const options = useMemo(
    () =>
      createChartOptions(
        metric,
        filterSeriesByMetric(series, metric.seriesKey),
        theme,
      ),
    [metric, series, theme],
  )

  return (
    <Box
      component={Paper}
      elevation={0}
      border={1}
      overflow="hidden"
      sx={{
        borderColor: (theme) => theme.border.default,
        borderRadius: 'borderRadius',
      }}
    >
      <Box padding="1.1875rem 1.5rem">
        <Typography color="text.primary" component="h2" variant="h6">
          {metric.title}
        </Typography>
      </Box>
      <Divider />
      <Box
        overflow="auto hidden"
        padding="0.75rem 1.5rem 0.5rem 0.25rem"
      >
        <Box
          sx={{
            minWidth: {
              xs: '56.25rem',
              md: 'auto',
            },
          }}
        >
          <HighchartsReact
            containerProps={{
              style: { height: '26.9375rem' },
            }}
            highcharts={Highcharts}
            options={options}
          />
        </Box>
      </Box>
    </Box>
  )
}
