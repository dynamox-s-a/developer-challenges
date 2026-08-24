import { useEffect } from 'react';
import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import { HighchartsReact } from 'highcharts-react-official';
import type { MeasurementSeries } from '@/features/measurements/model/types';
import { createChartOptions } from './chartOptions';

Highcharts.setOptions({
	lang: {
		accessibility: {
			chartContainerLabel: '{title}. Gráfico interativo.',
			graphicContainerLabel: '{title}. Gráfico interativo.',
			legend: {
				legendItem: 'Exibir {itemName}',
				legendLabel: 'Legenda do gráfico: {legendTitle}',
				legendLabelNoTitle: 'Alternar visibilidade das séries de {chartTitle}',
			},
			screenReaderSection: {
				endOfChartMarker: 'Fim do gráfico interativo.',
			},
			svgContainerLabel: 'Gráfico interativo.',
			svgContainerTitle: 'Gráfico interativo',
		},
		locale: 'pt-BR',
	},
});

interface TimeSeriesChartProps {
	chartId: string;
	title: string;
	unit: string;
	series: MeasurementSeries[];
	labelledBy?: string;
	onChartReady?: (chart: Highcharts.Chart | null) => void;
}

export function localizeChartSvgDescription(
	chart: Pick<Highcharts.Chart, 'container'>,
	description: string,
) {
	const svgDescription = chart.container.querySelector('svg > desc');
	if (svgDescription) svgDescription.textContent = description;
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
			callback={(chart: Highcharts.Chart) => {
				localizeChartSvgDescription(chart, `${title}. Gráfico temporal com valores em ${unit}.`);
				onChartReady?.(chart);
			}}
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
