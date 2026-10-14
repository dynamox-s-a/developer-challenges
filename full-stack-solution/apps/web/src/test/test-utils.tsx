import type { PropsWithChildren, ReactElement } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { createStore, type AppStore, type RootState } from "@web/app/store";
import { theme } from "@web/theme";

export interface RenderWithProvidersOptions extends Omit<RenderOptions, "wrapper"> {
  preloadedState?: Partial<RootState>;
  /** Reuse an existing store to inspect dispatched state afterwards. */
  store?: AppStore;
  /** Initial router location. */
  route?: string;
}

export interface RenderWithProvidersResult extends RenderResult {
  store: AppStore;
}

/**
 * Renders a component inside the providers it needs in production: Redux
 * store, MUI theme and a router.
 *
 * Returns the store so tests can assert on the state a user interaction
 * produced instead of spying on dispatch.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createStore(preloadedState),
    route = "/",
    ...renderOptions
  }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
