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

export const fetchMachines = createAsyncThunk<Machine[]>(
  actionTypes.FETCH_MACHINES,
  async () => await fetchMachinesController(),
);

export const fetchSensors = createAsyncThunk<Sensor[]>(
  actionTypes.FETCH_SENSORS,
  async () => await fetchSensorsController(),
);

export const createMachineThunk = createAsyncThunk<Machine, Machine>(
  actionTypes.CREATE_MACHINE,
  async (model) => await createMachineController(model),
);

export const updateMachineThunk = createAsyncThunk<Machine, Machine>(
  actionTypes.UPDATE_MACHINE,
  async (machine) => await updateMachineController(machine),
);

export const addMonitoringPointThunk = createAsyncThunk<
  MonitoringPoint,
  { machineId: string; monitoringPoint: MonitoringPoint }
>(
  actionTypes.ADD_MONITORING_POINT,
  async ({ machineId, monitoringPoint }) =>
    await addMonitoringPointController(machineId, monitoringPoint),
);

export const deleteMachineThunk = createAsyncThunk<void, string>(
  actionTypes.DELETE_MACHINE,
  async (machineId) => await deleteMachineController(machineId),
);

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
