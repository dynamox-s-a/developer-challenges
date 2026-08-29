import { CssBaseline, ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { createHttpApiClient } from "./api/client";
import { type AppStore, createAppStore } from "./app/store";
import { theme } from "./app/theme";
import { readSession } from "./auth/session";
import { checkSession, sessionExpired } from "./features/auth/authSlice";
import "./styles.css";

let store: AppStore | undefined;

const api = createHttpApiClient({
  origin: import.meta.env.VITE_API_ORIGIN ?? "",
  getToken: () => readSession()?.accessToken ?? null,
  onUnauthorized: () => store?.dispatch(sessionExpired()),
});

store = createAppStore(api);

if (store.getState().auth.status === "checking") {
  void store.dispatch(checkSession());
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
