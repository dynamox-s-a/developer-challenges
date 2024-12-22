import {
  addMonitoringPointController,
  createMachineController,
  deleteMachineController,
  deleteMonitoringPointController,
  fetchMachinesController,
  fetchSensorsController,
} from "@/controller/machines";
import { Machine, MonitoringPoint, Sensor } from "@/types/machines";

/**
 * Service to fetch machines by calling the controller.
 * @returns {Promise<Machine[]>} List of machines.
 */
export const fetchMachinesService = async (): Promise<Machine[]> => {
  return fetchMachinesController();
};

export const fetchSensorsService = async (): Promise<Sensor[]> => {
  return fetchSensorsController();
};
/**
 * Service to create a new machine by calling the controller.
 * @param machine The machine data to be created.
 * @returns {Promise<Machine>} The created machine.
 */
export const createMachineService = async (machine: Machine) => {
  return createMachineController(machine);
};

export const addMonitoringPoint = async (
  machineId: string,
  monitoringPoint: MonitoringPoint,
) => {
  return addMonitoringPointController(machineId, monitoringPoint);
};

export const deleteMachine = async (machineId: string) => {
  return deleteMachineController(machineId);
};

export const deleteMonitoringPoint = async (
  machineId: string,
  monitoringPointId: string,
) => {
  return deleteMonitoringPointController(machineId, monitoringPointId);
};
