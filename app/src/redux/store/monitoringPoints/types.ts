import { FetchStatus } from "../../types";
import { IMachine } from "./../machines/types";

export enum Sensors {
  tcAg = "TcAg",
  tcAf = "TcAs",
  hf = "HF+",
}

export interface IPagination {
  page: number;
  limit: number;
}

export enum ColumnOrder {
  asc = "ASC",
  desc = "DESC",
}
export interface ITableSort {
  orderBy: string;
  order: ColumnOrder;
}

export interface IGetPagination {
  pagination: IPagination;
  sort: ITableSort;
}

export interface IMonitoringPoint {
  id: number;
  name: string;
  machineId: number;
  sensor: Sensors;
}

export interface IMonitoringPointStore extends IMachine {
  monitoring_points: IMonitoringPoint[];
}

export interface IMonitoringPointsState {
  readonly monitoringPoints: IMonitoringPointStore[];
  readonly total: number;
  readonly sensors: Sensors[];
  readonly status: FetchStatus;
  readonly error: string | undefined;
}
