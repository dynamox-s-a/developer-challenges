import { useEffect } from 'react';
import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import { HighchartsReact } from 'highcharts-react-official';
import type { MeasurementSeries } from '@/features/measurements/model/types';
import { createChartOptions } from './chartOptions';

interface TimeSeriesChartProps {
	chartId: string;
	title: string;
	unit: string;
	series: MeasurementSeries[];
	labelledBy?: string;
	onChartReady?: (chart: Highcharts.Chart | null) => void;
}

export function TimeSeriesChart({
	chartId,
	title,
	unit,
	series,
	labelledBy,
	onChartReady,
}: TimeSeriesChartProps) {
	useEffect(() => {
		return () => onChartReady?.(null);
	}, [onChartReady]);

	return (
		<HighchartsReact
			highcharts={Highcharts}
			options={createChartOptions({ title, unit, series })}
			callback={(chart: Highcharts.Chart) => onChartReady?.(chart)}
			containerProps={{
				...(labelledBy
					? { 'aria-labelledby': labelledBy }
					: { 'aria-label': `Gráfico de ${title}` }),
				'data-chart-id': chartId,
				id: chartId,
				style: { width: '100%' },
			}}
		/>
	);
}
