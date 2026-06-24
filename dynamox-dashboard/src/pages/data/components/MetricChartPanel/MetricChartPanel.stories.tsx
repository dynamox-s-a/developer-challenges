import type { Meta, StoryObj } from '@storybook/react-vite'
import type { IMeasurementSeries } from '../../../../modules/measurements/types'
import { MetricChartPanel } from '.'

const accelerationSeries: IMeasurementSeries[] = [
  {
    name: 'accelerationRms/x',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 4.2 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 6.8 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 3.4 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 7.1 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 5.6 },
    ],
  },
  {
    name: 'accelerationRms/y',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 5.1 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 7.5 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 6.2 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 9.8 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 8.4 },
    ],
  },
  {
    name: 'accelerationRms/z',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 2.4 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 3.6 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 2.9 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 4.5 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 3.8 },
    ],
  },
]

const temperatureSeries: IMeasurementSeries[] = [
  {
    name: 'temperature',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 27.2 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 28.1 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 27.8 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 29.4 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 30.1 },
    ],
  },
]

const velocitySeries: IMeasurementSeries[] = [
  {
    name: 'velocityRms/x',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 2.1 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 2.9 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 2.4 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 3.5 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 2.7 },
    ],
  },
  {
    name: 'velocityRms/y',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 3.8 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 4.1 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 3.6 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 4.8 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 4.2 },
    ],
  },
  {
    name: 'velocityRms/z',
    data: [
      { datetime: '2024-05-31T00:00:00.000Z', max: 1.4 },
      { datetime: '2024-06-01T00:00:00.000Z', max: 1.9 },
      { datetime: '2024-06-02T00:00:00.000Z', max: 1.6 },
      { datetime: '2024-06-03T00:00:00.000Z', max: 2.3 },
      { datetime: '2024-06-04T00:00:00.000Z', max: 2.0 },
    ],
  },
]

const meta = {
  argTypes: {
    metric: {
      control: 'object',
    },
    series: {
      control: 'object',
    },
  },
  component: MetricChartPanel,
  title: 'Data/MetricChartPanel',
} satisfies Meta<typeof MetricChartPanel>

export default meta

type Story = StoryObj<typeof meta>

export const Acceleration: Story = {
  args: {
    metric: {
      seriesKey: 'accelerationRms',
      title: 'Aceleração RMS',
      yAxisTitle: 'Aceleração (g)',
    },
    series: accelerationSeries,
  },
}

export const Temperature: Story = {
  args: {
    metric: {
      seriesKey: 'temperature',
      title: 'Temperatura',
      yAxisTitle: 'Temperatura (°C)',
    },
    series: temperatureSeries,
  },
}

export const Velocity: Story = {
  args: {
    metric: {
      seriesKey: 'velocityRms',
      title: 'Velocidade RMS',
      yAxisTitle: 'Velocidade (m/s)',
    },
    series: velocitySeries,
  },
}
