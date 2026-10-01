import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '../app/routes';
import { theme } from '../app/theme';
import { createStore } from '../store/store';

/** jsdom has no layout engine; the screen width is declared through matchMedia. */
export function setScreen(width: 'wide' | 'narrow') {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: width === 'wide',
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

/** Mounts the whole application at a path, with a fresh store and an in-memory router. */
export function renderApp(path: string) {
  const store = createStore();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
  );
  return { store, router };
}
