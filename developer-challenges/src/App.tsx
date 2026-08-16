import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";
import { store } from "./app/store";
import { DataPage } from "./pages/DataPage/DataPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Navigate to="/data" replace />} />
					<Route path="/data" element={<DataPage />} />
					<Route path="*" element={<NotFoundPage />} />
				</Routes>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
