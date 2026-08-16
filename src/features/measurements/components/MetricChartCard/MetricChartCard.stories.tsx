import type { Meta, StoryObj } from '@storybook/react-vite';
import { TimeSeriesChart } from '@/features/measurements/components/TimeSeriesChart';
import { accelerationSeries } from '@/features/measurements/components/TimeSeriesChart/storyData';
import { MetricChartCard } from './index';

const meta = {
	argTypes: {
		children: { control: false },
		titleId: { control: false },
	},
	args: {
		children: null,
		title: 'Aceleração RMS',
		titleId: 'metric-card-story-title',
	},
	component: MetricChartCard,
	tags: ['autodocs'],
	title: 'Measurements/MetricChartCard',
} satisfies Meta<typeof MetricChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithTimeSeriesChart: Story = {
	render: (args) => (
		<MetricChartCard title={args.title} titleId={args.titleId}>
			<TimeSeriesChart
				chartId="metric-card-story-chart"
				labelledBy={args.titleId}
				series={accelerationSeries}
				title={args.title}
				unit="g"
			/>
		</MetricChartCard>
	),
};
