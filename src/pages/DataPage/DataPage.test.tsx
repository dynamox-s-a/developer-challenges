import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import type { MeasurementsState } from '@/features/measurements/store/slice';
import type { MeasurementSeries } from '@/features/measurements/model/types';
import DataPage from './index';

const mockSeries: MeasurementSeries[] = [
	{
		id: 'accelerationRms-x',
		name: 'accelerationRms/x',
		metric: 'accelerationRms',
		axis: 'x',
		unit: 'g',
		data: [{ timestamp: 1699357200000, value: 1.2 }],
	},
];

function createFrozenStore(measurementsState: Partial<MeasurementsState> = {}) {
	const state: MeasurementsState = {
		data: [],
		status: 'idle',
		error: null,
		...measurementsState,
	};

	return configureStore({
		reducer: {
			measurements: () => state,
		},
	});
}

function renderWithStore(measurementsState: Partial<MeasurementsState> = {}) {
	const store = createFrozenStore(measurementsState);
	const spy = vi.spyOn(store, 'dispatch');

	const result = render(
		<Provider store={store}>
			<MemoryRouter>
				<DataPage />
			</MemoryRouter>
		</Provider>,
	);

	return { store, spy, ...result };
}

describe('DataPage', () => {
	it('dispatches measurementsRequested on mount', () => {
		const { spy } = renderWithStore();
		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'measurements/measurementsRequested' }),
		);
	});

	it('renders LoadingState when status is loading', () => {
		renderWithStore({ status: 'loading' });
		expect(screen.getByRole('status')).toBeInTheDocument();
		expect(screen.getByText('Carregando dados...')).toBeInTheDocument();
	});

	it('renders ErrorState when status is error', () => {
		renderWithStore({ status: 'error', error: 'Network failure' });
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Network failure')).toBeInTheDocument();
	});

	it('renders EmptyState when status is success with empty data', () => {
		renderWithStore({ status: 'success', data: [] });
		expect(screen.getByText('Nenhuma medição disponível.')).toBeInTheDocument();
	});

	it('renders MachineSummary when status is success with data', () => {
		renderWithStore({ status: 'success', data: mockSeries });
		expect(screen.getByText('Máquina 1023')).toBeInTheDocument();
		expect(screen.getByText('Ponto 20192')).toBeInTheDocument();
	});

	it('retry button dispatches measurementsRequested', async () => {
		const user = userEvent.setup();
		const { spy } = renderWithStore({ status: 'error', error: 'fail' });

		spy.mockClear();
		await user.click(screen.getByRole('button', { name: /tentar novamente/i }));
		expect(spy).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'measurements/measurementsRequested' }),
		);
	});
});
