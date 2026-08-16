import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMachineData } from "../../features/machineData/machineDataSlice";

export function DataPage() {
	const dispatch = useAppDispatch();
	const machineData = useAppSelector((state) => state.machineData);

	useEffect(() => {
		dispatch(fetchMachineData());
	}, [dispatch]);

	return <pre>{JSON.stringify(machineData, null, 2)}</pre>;
}

export default DataPage;
