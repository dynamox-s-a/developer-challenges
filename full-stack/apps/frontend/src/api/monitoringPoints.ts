import { api } from "../api";

export type MonitoringPointRow = {
  id: string;
  monitoringPointName: string;
  machineName: string;
  machineType: "Pump" | "Fan";
  sensorModel: "HF_plus" | "TcAg" | "TcAs";
  sensorUniqueId: string;
  createdAt: string;
};

export async function fetchMonitoringPoints(params: {
  take: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}) {
  const { take, skip, sortBy, sortOrder } = params;
  const { data } = await api.get<{
    items: MonitoringPointRow[];
    total: number;
    take: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  }>(`/monitoring-points?take=${take}&skip=${skip}&sortBy=${sortBy}&sortOrder=${sortOrder}`);

  return data;
}

export async function createMonitoringPoint(args: {
  machineId: string;
  name: string;
  sensor: { uniqueId: string; model: "HF_plus" | "TcAg" | "TcAs" };
}) {
  const { data } = await api.post(`/machines/${args.machineId}/monitoring-points`, {
    name: args.name,
    sensor: args.sensor,
  });
  return data;
}

export async function updateMonitoringPoint(id: string, payload: { name?: string }) {
  const { data } = await api.patch(`/monitoring-points/${id}`, payload);
  return data;
}

export async function deleteMonitoringPoint(id: string) {
  await api.delete(`/monitoring-points/${id}`);
}
