import { httpClient } from "./httpClient";
import type { MachineInfo, RawSeries } from "../features/machineData/types";

export const machineService = {
	getMachine: () => httpClient.get<MachineInfo>("/machine").then((response) => response.data),
	getReadings: () => httpClient.get<RawSeries[]>("/readings").then((response) => response.data),
};
