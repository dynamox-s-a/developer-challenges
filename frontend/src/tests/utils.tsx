import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { setupStore } from "../app/store";
import type { RootState } from "../app/store";
import { theme } from "../app/theme";
import { vi } from "vitest";
import { machineFixture, seriesDtoFixture } from "./features/data/fixtures";

type Options = {
  preloadedState?: Partial<RootState>;
  route?: string;
};

export function renderWithProviders(
  ui: ReactElement,
  { preloadedState, route = "/" }: Options = {},
) {
  const store = setupStore(preloadedState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </ThemeProvider>
      </Provider>,
    ),
  };
}

export function stubApi() {
  vi.stubEnv("VITE_API_URL", "http://api.test");
  const fetchMock = vi.fn<typeof fetch>(
    async (input) =>
      new Response(
        JSON.stringify(
          String(input).endsWith("/machine")
            ? machineFixture
            : seriesDtoFixture,
        ),
      ),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
