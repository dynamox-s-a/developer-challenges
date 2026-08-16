import { useEffect } from "react";
import { Provider } from "react-redux";
import "./App.css";
import { store } from "./app/store";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchMachineData } from "./features/machineData/machineDataSlice";

function MachineDataView() {
	const dispatch = useAppDispatch();
	const machineData = useAppSelector((state) => state.machineData);

	useEffect(() => {
		dispatch(fetchMachineData());
	}, [dispatch]);

	return <pre>{JSON.stringify(machineData, null, 2)}</pre>;
}

function App() {
	return (
		<Provider store={store}>
			<MachineDataView />
		</Provider>
	);
}

export default App;
