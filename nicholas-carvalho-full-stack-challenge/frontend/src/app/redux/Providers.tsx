"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "../theme/theme";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <CssBaseline />
                {children}
            </Provider>
        </ThemeProvider>
    );
};