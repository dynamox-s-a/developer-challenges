const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

import { Machine, MonitoringPoint, Sensor } from "@/types/machines";
import { machine } from "os";

/**
 * Fetch machines from the API.
 * @returns {Promise<Machine[]>} List of machines.
 */
export const fetchMachinesController = async (): Promise<Machine[]> => {
  const response = await fetch(`${API_URL}/machines`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch machines");
  }

  return await response.json();
};

export const fetchSensorsController = async (): Promise<Sensor[]> => {
  const response = await fetch(`${API_URL}/machines/sensors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch machines");
  }

  return await response.json();
};

/**
 * Create a machine in the API.
 * @param machine The machine data to be created.
 * @returns {Promise<Machine>} The created machine.
 */
export const createMachineController = async (machine: Machine) => {
  const response = await fetch(`${API_URL}/machines`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(machine),
  });

  if (!response.ok) {
    throw new Error("Failed to create machine");
  }

  return await response.json();
};

export const addMonitoringPointController = async (
  machineId: string,
  monitoringPoint: MonitoringPoint,
) => {
  const response = await fetch(
    `${API_URL}/machines/${machineId}/monitoring-points`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monitoringPoint),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to add monitoring point");
  }

  return await response.json();
};

export const deleteMachineController = async (machineId: string) => {
  const response = await fetch(`${API_URL}/machines/${machineId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete machine");
  }

  return await response.json();
};

export const deleteMonitoringPointController = async (
  machineId: string,
  monitoringPointId: string,
) => {
  const response = await fetch(
    `${API_URL}/machines/${machineId}/monitoring-points/${monitoringPointId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete monitoring point");
  }

  return await response.json();
};
