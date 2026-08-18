import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";
import { store } from "./app/store";
import { Flex } from "./components/Flex/Flex";

const DataPage = lazy(() => import("./pages/DataPage/DataPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

function RouteFallback() {
	return (
		<Flex justify="center" m={4}>
			<CircularProgress />
		</Flex>
	);
}

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Suspense fallback={<RouteFallback />}>
					<Routes>
						<Route path="/" element={<Navigate to="/data" replace />} />
						<Route path="/data" element={<DataPage />} />
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
