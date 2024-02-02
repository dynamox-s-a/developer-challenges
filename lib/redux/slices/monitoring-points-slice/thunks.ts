import { createAppAsyncThunk } from "@/lib/redux/createAppAsyncThunk";

interface NewMonitoringPoint {
  name: string;
  machineId: number;
  sensorId: number;
}

export const getMonitoringPoints = createAppAsyncThunk(
  "monitoringPoints/getMonitoringPoints",
  async () => {
    const response = await fetch("/api/monitoring-point");
    const result = await response.json();

    // The value we return becomes the `fulfilled` action payload
    return result;
  }
);

export const createMonitoringPoint = createAppAsyncThunk(
  "monitoringPoints/createMonitoringPoint",
  async (monitoringPoint: NewMonitoringPoint) => {
    const response = await fetch("/api/monitoring-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(monitoringPoint),
    });
    const result = await response.json();

    return result;
  }
);
