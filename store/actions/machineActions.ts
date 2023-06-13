import { Machine, MonitoringPoint } from "../../src/types/types";
import { Dispatch } from "redux";
import axios from "axios";

export const SET_MACHINES = "SET_MACHINES";
export const SET_MONITORING_POINTS = "SET_MONITORING_POINTS";
export const ADD_MACHINE = "ADD_MACHINE";
export const DELETE_MACHINE = "DELETE_MACHINE";

interface SetMachinesAction {
  type: typeof SET_MACHINES;
  payload: Machine[];
}

interface SetMonitoringPointsAction {
  type: typeof SET_MONITORING_POINTS;
  payload: MonitoringPoint[];
}

interface AddMachineAction {
  type: typeof ADD_MACHINE;
  payload: Machine;
}

interface DeleteMachineAction {
  type: typeof DELETE_MACHINE;
  payload: Machine;
}

export const setMachines = (machines: Machine[]): SetMachinesAction => ({
  type: SET_MACHINES,
  payload: machines,
});

export const setMonitoringPoints = (
  monitoringPoints: MonitoringPoint[]
): SetMonitoringPointsAction => ({
  type: SET_MONITORING_POINTS,
  payload: monitoringPoints,
});

export const addMachine = (machine: Machine) => {
  return async (dispatch: Dispatch<AddMachineAction>) => {
    try {
      const response = await axios.post("/api/postMachine/1", machine, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to add machine");
      }

      const addedMachine = response.data;
      dispatch({ type: ADD_MACHINE, payload: addedMachine });
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteMachine = (id: number | null) => {
  return async (dispatch: Dispatch<DeleteMachineAction>) => {
    try {
      const response = await axios.post(`/api/deleteMachine/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to add machine");
      }

      const deletedMachineId = response.data.id;
      dispatch({ type: DELETE_MACHINE, payload: deletedMachineId });
    } catch (error) {
      console.error(error);
    }
  };
};
