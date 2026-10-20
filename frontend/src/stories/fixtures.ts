import db from "../../mock/db.json";
import type { MachineDto, SeriesDto } from "../features/data/types";
import { toChartData } from "../features/data/transform";

export const machine: MachineDto = db.machine;
export const seriesDto = db.series as SeriesDto[];
export const charts = toChartData(seriesDto);
