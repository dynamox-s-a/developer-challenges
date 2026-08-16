import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './index';

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
	if (shouldThrow) {
		throw new Error('Test error');
	}
	return <div>Normal content</div>;
}

describe('ErrorBoundary', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('renders children when there is no error', () => {
		render(
			<ErrorBoundary>
				<ThrowingComponent shouldThrow={false} />
			</ErrorBoundary>,
		);
		expect(screen.getByText('Normal content')).toBeInTheDocument();
	});

	it('renders fallback when child throws an error', () => {
		render(
			<ErrorBoundary>
				<ThrowingComponent shouldThrow={true} />
			</ErrorBoundary>,
		);
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2, name: 'Algo deu errado' })).toBeInTheDocument();
		expect(screen.getByText('Test error')).toBeInTheDocument();
	});

	it('renders custom fallback when provided', () => {
		render(
			<ErrorBoundary fallback={<div>Custom fallback</div>}>
				<ThrowingComponent shouldThrow={true} />
			</ErrorBoundary>,
		);
		expect(screen.getByText('Custom fallback')).toBeInTheDocument();
	});

	it('calls console.error when catching an error', () => {
		render(
			<ErrorBoundary>
				<ThrowingComponent shouldThrow={true} />
			</ErrorBoundary>,
		);
		expect(console.error).toHaveBeenCalled();
	});
});
