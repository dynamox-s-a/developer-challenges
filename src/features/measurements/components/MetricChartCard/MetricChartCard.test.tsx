import { render, screen } from '@testing-library/react';
import { MetricChartCard } from '.';

describe('MetricChartCard', () => {
	it('renders its title, content and accessible relationships', () => {
		render(
			<MetricChartCard title="Aceleração RMS" titleId="acceleration-title">
				<div>Conteúdo do gráfico</div>
			</MetricChartCard>,
		);

		const title = screen.getByRole('heading', { level: 2, name: 'Aceleração RMS' });
		const card = screen.getByRole('region', { name: 'Aceleração RMS' });
		const chartArea = screen.getByRole('group', { name: 'Aceleração RMS' });

		expect(title).toHaveAttribute('id', 'acceleration-title');
		expect(card).toContainElement(chartArea);
		expect(chartArea).toHaveTextContent('Conteúdo do gráfico');
	});
});
