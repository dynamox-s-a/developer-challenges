import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from './index';

describe('ErrorState', () => {
	it('displays default error message', () => {
		render(<ErrorState />);
		expect(screen.getByText('Ocorreu um erro ao carregar os dados.')).toBeInTheDocument();
	});

	it('displays custom error message', () => {
		render(<ErrorState message="Falha na conexão" />);
		expect(screen.getByText('Falha na conexão')).toBeInTheDocument();
	});

	it('renders retry button when onRetry is provided', () => {
		render(<ErrorState onRetry={() => {}} />);
		expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
	});

	it('does not render retry button when onRetry is undefined', () => {
		render(<ErrorState />);
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('calls onRetry when button is clicked', async () => {
		const user = userEvent.setup();
		const handleRetry = vi.fn();
		render(<ErrorState onRetry={handleRetry} />);

		await user.click(screen.getByRole('button', { name: /tentar novamente/i }));
		expect(handleRetry).toHaveBeenCalledOnce();
	});

	it('has role="alert"', () => {
		render(<ErrorState />);
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});
});
