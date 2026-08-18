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

const MACHINE_INFO_FIELDS: {
	key: keyof MachineInfo;
	icon: IconName;
	label: string;
}[] = [
	{ key: "machine", icon: "Machine", label: "Máquina" },
	{ key: "point", icon: "GpsFixed", label: "Ponto" },
	{ key: "rpm", icon: "Rpm", label: "RPM" },
	{ key: "range", icon: "DynamicRange", label: "Faixa dinâmica" },
	{ key: "duration", icon: "AccessTime", label: "Duração" },
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
		<Flex direction="column" gap={3}>
			<Paper
				elevation={0}
				square
				sx={{ py: 2, borderBottom: "1px solid", borderColor: "grey.300" }}
			>
				<Typography text="Análise de Dados" fontSize={20} fontWeight={500} ml={3} mr={3} />
			</Paper>

			<Flex direction="column" gap={3} ml={3} mr={3} mb={3}>
				{machine && (
					<Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
						<Flex justify="space-between" align="center" gap={2}>
							{MACHINE_INFO_FIELDS.map((field) => (
								<Flex key={field.key} align="center" gap={1}>
									<Icon
										icon={field.icon}
										text={field.label}
										color="action"
										size="small"
									/>
									<Typography text={machine[field.key]} fontSize={14} />
								</Flex>
							))}
						</Flex>
					</Paper>
				)}

				<Paper variant="outlined" sx={{ p: 2 }}>
					<Flex direction="column" gap={2}>
						<Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
							<Typography text="Aceleração RMS" fontSize={14} bold mb={2} />
							<Divider sx={{ mx: -2 }} />
							<Flex direction="column" mt={2}>
								<AccelerationChart readings={readings} />
							</Flex>
						</Paper>

						<Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
							<Typography text="Temperatura" fontSize={14} bold mb={2} />
							<Divider sx={{ mx: -2 }} />
							<Flex direction="column" mt={2}>
								<TemperatureChart readings={readings} />
							</Flex>
						</Paper>

						<Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
							<Typography text="Velocidade RMS" fontSize={14} bold mb={2} />
							<Divider sx={{ mx: -2 }} />
							<Flex direction="column" mt={2}>
								<VelocityChart readings={readings} />
							</Flex>
						</Paper>
					</Flex>
				</Paper>
			</Flex>
		</Flex>
	);
}

export default DataPage;
