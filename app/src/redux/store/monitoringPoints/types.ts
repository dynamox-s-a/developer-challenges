import { FetchStatus } from "../../types";
import { IMachine } from "./../machines/types";

export enum Sensors {
  tcAg = "TcAg",
  tcAf = "TcAs",
  hf = "HF+",
}

export interface IListPoint {
  id: number;
  name: string;
  machineId: number;
  sensor: Sensors;
}

export interface IMonitoringPoint extends IMachine {
  monitoring_points: IListPoint[];
}

export interface IMonitoringPointsState {
  readonly monitoringPoints: IMonitoringPoint[];
  readonly listPoints: IListPoint[];
  readonly total: number;
  readonly sensors: Sensors[];
  readonly status: FetchStatus;
  readonly error: string | undefined;
}
