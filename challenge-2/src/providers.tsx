"use client";

import { AuthInitializer } from "@/components/auth-initializer";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Provider } from "react-redux";
import { store } from "./store";
import { theme } from "./theme";
import { ThemeProvider } from "@emotion/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<AppRouterCacheProvider
				options={{
					key: "css",
				}}
			>
				<ThemeProvider theme={theme}>
					<AuthInitializer />
					{children}
				</ThemeProvider>
			</AppRouterCacheProvider>
		</Provider>
	);
}
