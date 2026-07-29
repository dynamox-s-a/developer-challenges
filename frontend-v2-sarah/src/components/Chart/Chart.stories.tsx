import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  mockChartDataTemperature,
  mockChartDataThreeLines,
} from '../../mocks/metricsMock';
import { Chart } from './index';

const meta: Meta<typeof Chart> = {
  title: 'Components/Chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Objeto contendo os dados e configurações do Highcharts',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chart>;

export const Default: Story = {
  args: {
    data: mockChartDataTemperature,
  },
};

export const ThreeLines: Story = {
  args: {
    data: mockChartDataThreeLines,
  },
};
