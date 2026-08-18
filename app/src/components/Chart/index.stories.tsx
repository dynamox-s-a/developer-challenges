import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import Box from '@mui/material/Box';
import Chart from './index';

const baseTimestamp = new Date('2026-01-01T00:00:00Z').getTime();

function buildSeries(name: string, values: number[]) {
  return {
    type: 'line' as const,
    name,
    data: values.map((value, index) => [baseTimestamp + index * 24 * 60 * 60 * 1000, value]),
  };
}

const multiSeries: ComponentProps<typeof Chart>['series'] = [
  buildSeries('Aceleração X', [1.12, 1.18, 1.09, 1.2, 1.16, 1.24]),
  buildSeries('Aceleração Y', [1.05, 1.11, 1.08, 1.14, 1.19, 1.21]),
  buildSeries('Aceleração Z', [0.98, 1.02, 1.04, 1.01, 1.06, 1.1]),
];

const singleSeries: ComponentProps<typeof Chart>['series'] = [
  buildSeries('Temperatura', [24.3, 24.7, 25.1, 24.9, 25.4, 25.8]),
];

const meta = {
  title: 'Components/Chart',
  component: Chart,
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 980, width: '100%' }}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: 'Aceleração RMS',
    xAxisTitle: 'Aceleração RMS (g)',
    series: multiSeries,
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleSeries: Story = {
  args: {
    title: 'Temperatura',
    xAxisTitle: 'Temperatura (ºC)',
    series: singleSeries,
  },
};

export const EmptyState: Story = {
  args: {
    series: [],
  },
};
