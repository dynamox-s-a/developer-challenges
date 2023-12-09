import { Sensors } from "../../../types";
import { FetchStatus } from "../../types";

export interface IMonitoringPointStore {
  id: number;
  name: string;
  machineName: string;
  machineType: string;
  sensor: Sensors;
}

export interface IMonitoringPointsState {
  readonly monitoringPoints: IMonitoringPointStore[];
  readonly status: FetchStatus;
  readonly error: string | undefined;
}

export interface IMonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  sensor: Sensors;
}
