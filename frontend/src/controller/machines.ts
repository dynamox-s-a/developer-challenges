const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

import { httpClient } from "@/utils/httpClient";
import { Machine, MonitoringPoint, Sensor } from "@/types/machines";

/**
 * Fetches the list of machines from the API.
 * @returns {Promise<Machine[]>} List of machines.
 */
export const fetchMachinesController = async (): Promise<Machine[]> => {
  return httpClient<Machine[]>(`${API_URL}/machines`, "GET");
};

/**
 * Fetches the list of sensors from the API.
 * @returns {Promise<Sensor[]>} List of sensors.
 */
export const fetchSensorsController = async (): Promise<Sensor[]> => {
  return httpClient<Sensor[]>(`${API_URL}/machines/sensors`, "GET");
};

/**
 * Creates a new machine in the API.
 * @param {Machine} machine - The machine data to be created.
 * @returns {Promise<Machine>} The created machine.
 */
export const createMachineController = async (machine: Machine): Promise<Machine> => {
  return httpClient<Machine>(`${API_URL}/machines`, "POST", machine);
};

/**
 * Updates an existing machine in the API.
 * @param {Machine} machine - The machine data to be updated.
 * @returns {Promise<Machine>} The updated machine.
 */
export const updateMachineController = async (machine: Machine): Promise<Machine> => {
  return httpClient<Machine>(`${API_URL}/machines/${machine.id}`, "PUT", {
    name: machine.name,
    type: machine.type,
  });
};

/**
 * Adds a monitoring point to a machine in the API.
 * @param {string} machineId - The ID of the machine.
 * @param {MonitoringPoint} monitoringPoint - The monitoring point data to be added.
 * @returns {Promise<MonitoringPoint>} The added monitoring point.
 */
export const addMonitoringPointController = async (
  machineId: string,
  monitoringPoint: MonitoringPoint
): Promise<MonitoringPoint> => {
  return httpClient<MonitoringPoint>(
    `${API_URL}/machines/${machineId}/monitoring-points`,
    "POST",
    monitoringPoint
  );
};

/**
 * Deletes a machine from the API.
 * @param {string} machineId - The ID of the machine to be deleted.
 * @returns {Promise<void>} Resolves when the machine is deleted.
 */
export const deleteMachineController = async (machineId: string): Promise<void> => {
  return httpClient<void>(`${API_URL}/machines/${machineId}`, "DELETE");
};

/**
 * Deletes a monitoring point from a machine in the API.
 * @param {string} machineId - The ID of the machine.
 * @param {string} monitoringPointId - The ID of the monitoring point to be deleted.
 * @returns {Promise<void>} Resolves when the monitoring point is deleted.
 */
export const deleteMonitoringPointController = async (
  machineId: string,
  monitoringPointId: string
): Promise<void> => {
  return httpClient<void>(
    `${API_URL}/machines/${machineId}/monitoring-points/${monitoringPointId}`,
    "DELETE"
  );
};