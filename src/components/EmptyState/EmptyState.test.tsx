import { render, screen } from '@testing-library/react';
import { EmptyState } from './index';

describe('EmptyState', () => {
	it('displays default message', () => {
		render(<EmptyState />);
		expect(screen.getByText('Nenhuma medição disponível.')).toBeInTheDocument();
	});

	it('displays custom message', () => {
		render(<EmptyState message="Sem resultados" />);
		expect(screen.getByText('Sem resultados')).toBeInTheDocument();
	});
});
