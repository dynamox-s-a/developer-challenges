import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import measurementsReducer from '@/features/measurements/store/slice';
import DataPage from '@/pages/DataPage';

describe('App', () => {
	it('renders DataPage without crashing', () => {
		const store = configureStore({
			reducer: { measurements: measurementsReducer },
		});

		render(
			<Provider store={store}>
				<MemoryRouter>
					<DataPage />
				</MemoryRouter>
			</Provider>,
		);
		expect(screen.getByText('Análise de Dados')).toBeInTheDocument();
	});
});
