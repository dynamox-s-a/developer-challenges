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
		const card = screen.getByRole('article', { name: 'Aceleração RMS' });

		expect(title).toHaveAttribute('id', 'acceleration-title');
		expect(card).toHaveTextContent('Conteúdo do gráfico');
		expect(screen.queryByRole('group')).not.toBeInTheDocument();
	});
});
