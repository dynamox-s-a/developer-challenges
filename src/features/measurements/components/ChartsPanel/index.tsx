import { useMemo } from 'react';
import type Highcharts from 'highcharts';
import Box from '@mui/material/Box';
import { useAppSelector } from '@/store/hooks';
import {
	selectAccelerationSeries,
	selectTemperatureSeries,
	selectVelocitySeries,
} from '../../store/selectors';
import { MetricChartCard } from '../MetricChartCard';
import { TimeSeriesChart } from '../TimeSeriesChart';
import { useChartSynchronization } from './useChartSynchronization';

const charts = [
	{
		id: 'acceleration-chart',
		title: 'Aceleração RMS',
		unit: 'g',
	},
	{
		id: 'temperature-chart',
		title: 'Temperatura',
		unit: '°C',
	},
	{
		id: 'velocity-chart',
		title: 'Velocidade RMS',
		unit: 'mm/s',
	},
] as const;

type ChartId = (typeof charts)[number]['id'];

export function ChartsPanel() {
	const accelerationSeries = useAppSelector(selectAccelerationSeries);
	const temperatureSeries = useAppSelector(selectTemperatureSeries);
	const velocitySeries = useAppSelector(selectVelocitySeries);
	const seriesByChart = {
		'acceleration-chart': accelerationSeries,
		'temperature-chart': temperatureSeries,
		'velocity-chart': velocitySeries,
	};
	const { registerChart } = useChartSynchronization();
	const chartReadyHandlers = useMemo<Record<ChartId, (chart: Highcharts.Chart | null) => void>>(
		() => ({
			'acceleration-chart': (chart) => registerChart('acceleration-chart', chart),
			'temperature-chart': (chart) => registerChart('temperature-chart', chart),
			'velocity-chart': (chart) => registerChart('velocity-chart', chart),
		}),
		[registerChart],
	);

	return (
		<Box
			component="section"
			aria-label="Gráficos de medições"
			sx={{
				backgroundColor: 'background.paper',
				border: 1,
				borderColor: 'divider',
				borderRadius: 1,
				display: 'grid',
				gap: 3,
				minWidth: 0,
				p: { xs: 2, sm: 3 },
			}}
		>
			{charts.map((chart) => {
				const titleId = `${chart.id}-title`;
				return (
					<MetricChartCard key={chart.id} title={chart.title} titleId={titleId}>
						<TimeSeriesChart
							chartId={chart.id}
							labelledBy={titleId}
							onChartReady={chartReadyHandlers[chart.id]}
							series={seriesByChart[chart.id]}
							title={chart.title}
							unit={chart.unit}
						/>
					</MetricChartCard>
				);
			})}
		</Box>
	);
}
