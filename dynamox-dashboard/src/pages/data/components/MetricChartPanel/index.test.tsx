import { ThemeProvider } from '@mui/material'
import { cleanup, render, screen } from '@testing-library/react'
import type { Options } from 'highcharts'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { measurementsMock } from '../../../../modules/measurements/measurementsMock'
import { theme } from '../../../../theme'
import { MetricChartPanel, type MetricConfig } from '.'

let chartOptions: Options | undefined

vi.mock('highcharts-react-official', () => ({
  default: ({ options }: { options: Options }) => {
    chartOptions = options

    return <div data-testid="metric-chart" />
  },
}))

const metric: MetricConfig = {
  seriesKey: 'accelerationRms',
  title: 'Aceleração RMS',
  yAxisTitle: 'Aceleração (g)',
}

function renderMetricChartPanel() {
  return render(
    <ThemeProvider theme={theme}>
      <MetricChartPanel metric={metric} series={measurementsMock} />
    </ThemeProvider>,
  )
}

describe('MetricChartPanel', () => {
  afterEach(() => {
    chartOptions = undefined
    cleanup()
  })

  it('renders the metric title and chart container', () => {
    renderMetricChartPanel()

    expect(screen.getByText('Aceleração RMS')).toBeTruthy()
    expect(screen.getByTestId('metric-chart')).toBeTruthy()
  })

  it('passes only the selected metric series to Highcharts', () => {
    renderMetricChartPanel()

    expect(chartOptions?.series).toHaveLength(1)
    expect(chartOptions?.series?.[0]).toMatchObject({
      color: '#2386CB',
      name: 'Axial',
      type: 'line',
    })
  })

  it('maps measurement points to timestamp and max value pairs', () => {
    renderMetricChartPanel()

    expect(chartOptions?.series?.[0]).toMatchObject({
      data: [[new Date('2024-05-31T00:00:00.000Z').getTime(), 4.2]],
    })
  })

  it('sets the y-axis title from the metric config', () => {
    renderMetricChartPanel()

    expect(chartOptions?.yAxis).toMatchObject({
      title: {
        text: 'Aceleração (g)',
      },
    })
  })
})
