import { ThemeProvider } from '@mui/material';
import { render, type RenderOptions } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, type InitialEntry } from 'react-router-dom';
import { setupStore, type AppStore, type RootState } from '../app/store';
import { createAppTheme } from '../theme/createAppTheme';

// The app's own theme, as App provides it (e.g. palette.chart for charts).
const theme = createAppTheme('light');

interface ProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  route?: InitialEntry;
}

/** Renders inside a fresh store, the app theme and an in-memory router. */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    route = '/',
    ...options
  }: ProvidersOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}

/** An axios error as the API would produce it, for mocked services. */
export function httpError(status: number, data: unknown): AxiosError {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError(
    `Request failed with status code ${status}`,
    AxiosError.ERR_BAD_REQUEST,
    config,
    null,
    { status, statusText: String(status), data, headers: {}, config },
  );
}
