import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import measurementsReducer from '@/features/measurements/store/slice';
import { appRoutes } from './routes';

describe('App', () => {
	function renderRoute(path: string) {
		const store = configureStore({
			reducer: { measurements: measurementsReducer },
		});
		const router = createMemoryRouter(appRoutes, { initialEntries: [path] });

		return render(
			<Provider store={store}>
				<RouterProvider router={router} />
			</Provider>,
		);
	}

	it.each(['/', '/data'])('renders the data page at %s', async (path) => {
		renderRoute(path);

		expect(await screen.findByText('Análise de Dados')).toBeInTheDocument();
	});

	it('renders the not-found page for unknown routes', () => {
		renderRoute('/unknown');

		expect(screen.getByText('404 — Página não encontrada')).toBeInTheDocument();
	});
});
