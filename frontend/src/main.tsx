import "./index.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { theme } from "./app/theme.ts";
import { ThemeProvider } from "@mui/material/styles";
import { store } from "./app/store.ts";
import { StrictMode } from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
