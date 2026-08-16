import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeSeriesChart } from './index';
import { accelerationSeries, temperatureSeries } from './storyData';

const meta = {
	argTypes: {
		onChartReady: { control: false },
		series: { control: false },
	},
	component: TimeSeriesChart,
	tags: ['autodocs'],
	title: 'Measurements/TimeSeriesChart',
} satisfies Meta<typeof TimeSeriesChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OneSeries: Story = {
	args: {
		chartId: 'temperature-story-chart',
		series: temperatureSeries,
		title: 'Temperatura',
		unit: '°C',
	},
};

export const ThreeSeries: Story = {
	args: {
		chartId: 'acceleration-story-chart',
		series: accelerationSeries,
		title: 'Aceleração RMS',
		unit: 'g',
	},
};
