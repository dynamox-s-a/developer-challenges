import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMachineData } from "../../features/machineData/machineDataSlice";
import type { MachineInfo } from "../../features/machineData/types";
import { Flex } from "../../components/Flex/Flex";
import { Icon, type IconName } from "../../components/Icon/Icon";
import { Typography } from "../../components/Typography/Typography";
import { AccelerationChart } from "./components/AccelerationChart/AccelerationChart";
import { TemperatureChart } from "./components/TemperatureChart/TemperatureChart";
import { VelocityChart } from "./components/VelocityChart/VelocityChart";

const MACHINE_INFO_FIELDS: { key: keyof MachineInfo; icon: IconName }[] = [
	{ key: "machine", icon: "Machine" },
	{ key: "point", icon: "GpsFixed" },
	{ key: "rpm", icon: "Rpm" },
	{ key: "range", icon: "DynamicRange" },
	{ key: "duration", icon: "AccessTime" },
];

export function DataPage() {
	const dispatch = useAppDispatch();
	const { machine, readings, status, error } = useAppSelector(
		(state) => state.machineData,
	);

	useEffect(() => {
		dispatch(fetchMachineData());
	}, [dispatch]);

	if (status === "idle" || status === "loading") {
		return (
			<Flex justify="center" m={4}>
				<CircularProgress />
			</Flex>
		);
	}

	if (status === "failed") {
		return (
			<Flex direction="column" m={3}>
				<Alert severity="error">{error}</Alert>
			</Flex>
		);
	}

	return (
		<Flex direction="column" gap={3} m={3}>
			<Flex direction="column">
				<Typography text="Análise de Dados" size="h5" />
				<Divider sx={{ mt: 2 }} />
			</Flex>

			{machine && (
				<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
					<Flex justify="space-between" align="center" gap={2}>
						{MACHINE_INFO_FIELDS.map((field) => (
							<Flex key={field.key} align="center" gap={1}>
								<Icon icon={field.icon} color="action" size="small" />
								<Typography text={machine[field.key]} />
							</Flex>
						))}
					</Flex>
				</Paper>
			)}

			<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
				<Typography text="Aceleração RMS" size="subtitle1" />
				<AccelerationChart readings={readings} />
			</Paper>

			<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
				<Typography text="Temperatura" size="subtitle1" />
				<TemperatureChart readings={readings} />
			</Paper>

			<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
				<Typography text="Velocidade RMS" size="subtitle1" />
				<VelocityChart readings={readings} />
			</Paper>
		</Flex>
	);
}

export default DataPage;
