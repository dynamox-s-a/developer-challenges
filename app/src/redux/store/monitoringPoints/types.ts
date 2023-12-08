import { Sensors } from "../../../types";

export interface IMonitoringPoint {
  id: number;
  name: string;
  machineName: string;
  machineType: string;
  sensor: Sensors;
}

export interface IMonitoringPointsState {
  readonly monitoringPoints: IMonitoringPoint[];
  readonly loading: boolean;
  readonly error: boolean;
}
