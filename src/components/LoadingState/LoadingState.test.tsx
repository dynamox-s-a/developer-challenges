import { render, screen } from '@testing-library/react';
import { LoadingState } from './index';

describe('LoadingState', () => {
	it('renders a spinner', () => {
		render(<LoadingState />);
		expect(screen.getByRole('progressbar')).toBeInTheDocument();
	});

	it('displays default message', () => {
		render(<LoadingState />);
		expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
	});

	it('displays custom message', () => {
		render(<LoadingState message="Aguarde..." />);
		expect(screen.getByText('Aguarde...')).toBeInTheDocument();
	});

	it('has role="status"', () => {
		render(<LoadingState />);
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});
