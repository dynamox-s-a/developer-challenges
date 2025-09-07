import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/ui/theme/theme";
import { AppGlobalStyles } from "@/ui/theme/globals";

import { Provider } from "react-redux";
import { store } from "@/app/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppGlobalStyles />
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
