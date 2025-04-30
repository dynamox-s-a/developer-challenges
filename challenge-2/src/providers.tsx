"use client";

import { AuthInitializer } from "@/components/auth-initializer";
import { Provider } from "react-redux";
import { store } from "./store";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Provider store={store}>
			<AuthInitializer />
			{children}
		</Provider>
	);
}
