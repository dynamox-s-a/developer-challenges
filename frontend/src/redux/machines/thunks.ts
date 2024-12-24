import { createAsyncThunk } from "@reduxjs/toolkit";
import * as actionTypes from "@/redux/machines/actionTypes";
import {
  fetchMachinesController,
  fetchSensorsController,
  createMachineController,
  updateMachineController,
  addMonitoringPointController,
  deleteMachineController,
  deleteMonitoringPointController,
} from "@/controller/machines";
import { Machine, MonitoringPoint, Sensor } from "@/types/machines";

/**
 * Fetches all machines from the server.
 * @returns {Promise<Machine[]>} The list of machines.
 */
export const fetchMachines = createAsyncThunk<Machine[]>(
  actionTypes.FETCH_MACHINES,
  async () => await fetchMachinesController(),
);

/**
 * Fetches all sensors from the server.
 * @returns {Promise<Sensor[]>} The list of sensors.
 */
export const fetchSensors = createAsyncThunk<Sensor[]>(
  actionTypes.FETCH_SENSORS,
  async () => await fetchSensorsController(),
);

/**
 * Creates a new machine.
 * @param {Machine} model - The machine model to be created.
 * @returns {Promise<Machine>} The created machine.
 */
export const createMachineThunk = createAsyncThunk<Machine, Machine>(
  actionTypes.CREATE_MACHINE,
  async (model) => await createMachineController(model),
);

/**
 * Updates an existing machine.
 * @param {Machine} machine - The machine model with updated data.
 * @returns {Promise<Machine>} The updated machine.
 */
export const updateMachineThunk = createAsyncThunk<Machine, Machine>(
  actionTypes.UPDATE_MACHINE,
  async (machine) => await updateMachineController(machine),
);

/**
 * Adds a new monitoring point to a specific machine.
 * @param {string} machineId - The ID of the machine to add the monitoring point to.
 * @param {MonitoringPoint} monitoringPoint - The monitoring point to be added.
 * @returns {Promise<MonitoringPoint>} The added monitoring point.
 */
export const addMonitoringPointThunk = createAsyncThunk<
  MonitoringPoint,
  { machineId: string; monitoringPoint: MonitoringPoint }
>(
  actionTypes.ADD_MONITORING_POINT,
  async ({ machineId, monitoringPoint }) =>
    await addMonitoringPointController(machineId, monitoringPoint),
);

/**
 * Deletes a specific machine.
 * @param {string} machineId - The ID of the machine to be deleted.
 * @returns {Promise<void>} No return value.
 */
export const deleteMachineThunk = createAsyncThunk<void, string>(
  actionTypes.DELETE_MACHINE,
  async (machineId) => await deleteMachineController(machineId),
);

/**
 * Deletes a specific monitoring point from a machine.
 * @param {string} machineId - The ID of the machine from which the monitoring point will be removed.
 * @param {string} monitoringPointId - The ID of the monitoring point to be deleted.
 * @returns {Promise<{ machineId: string; monitoringPointId: string }>} An object containing the IDs of the 
 * machine and the monitoring point that were deleted.
 */
export const deleteMonitoringPointThunk = createAsyncThunk<
  { machineId: string; monitoringPointId: string },
  { machineId: string; monitoringPointId: string }
>(
  actionTypes.DELETE_MONITORING_POINT,
  async ({ machineId, monitoringPointId }) => {
    await deleteMonitoringPointController(machineId, monitoringPointId);
    return { machineId, monitoringPointId };
  },
);