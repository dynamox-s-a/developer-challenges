import { Machine, MonitoringPoint, User } from "../../src/types/types";
import { Dispatch } from "redux";
import axios from "axios";

export const SET_MACHINES = "SET_MACHINES";
export const SET_MONITORING_POINTS = "SET_MONITORING_POINTS";
export const SET_USER = "SET_USER";
export const EDIT_MACHINE = "EDIT_MACHINE";
export const ADD_MACHINE = "ADD_MACHINE";
export const ADD_USER = "ADD_USER";
export const ADD_MONITORING_POINT = "ADD_MONITORING_POINT";
export const DELETE_MACHINE = "DELETE_MACHINE";

interface SetMachinesAction {
  type: typeof SET_MACHINES;
  payload: Machine[];
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

interface AddUserAction {
  type: typeof ADD_USER;
  payload: User;
}

interface SetMonitoringPointsAction {
  type: typeof SET_MONITORING_POINTS;
  payload: MonitoringPoint[];
}

interface EditMachineAction {
  type: typeof EDIT_MACHINE;
  payload: Machine;
}

interface AddMachineAction {
  type: typeof ADD_MACHINE;
  payload: Machine;
}

interface AddMonitoringPointAction {
  type: typeof ADD_MONITORING_POINT;
  payload: MonitoringPoint;
}

interface DeleteMachineAction {
  type: typeof DELETE_MACHINE;
  payload: Machine;
}

export const addUser = (user: User) => {
  return async (dispatch: Dispatch<AddUserAction>) => {
    try {
      const response = await axios.post("/api/postUser", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to add user");
      }

      const addedUser = response.data;
      console.log(addedUser);
      dispatch({ type: ADD_USER, payload: addedUser });
    } catch (error) {
      console.error(error);
    }
  };
};

export const setMachines = (machines: Machine[]): SetMachinesAction => ({
  type: SET_MACHINES,
  payload: machines,
});

export const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export const setMonitoringPoints = (
  monitoringPoints: MonitoringPoint[]
): SetMonitoringPointsAction => ({
  type: SET_MONITORING_POINTS,
  payload: monitoringPoints,
});

export const editMachine = (machine: Machine | null) => {
  return async (dispatch: Dispatch<EditMachineAction>) => {
    try {
      const response = await axios.post(
        `/api/editMachine/${machine?.id}`,
        machine,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to add machine");
      }

      const editedMachine = response.data;
      dispatch({ type: EDIT_MACHINE, payload: editedMachine });
    } catch (error) {
      console.error(error);
    }
  };
};

export const addMachine = (machine: Machine) => {
  return async (dispatch: Dispatch<AddMachineAction>) => {
    try {
      const response = await axios.post("/api/postMachine", machine, {
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

export const addMonitoringPoint = (monitoringPoint: MonitoringPoint) => {
  return async (dispatch: Dispatch<AddMonitoringPointAction>) => {
    try {
      const response = await axios.post(
        "/api/postMonitoringPoint",
        monitoringPoint,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to add machine");
      }

      const addedMonitoringPoint = response.data;
      dispatch({ type: ADD_MONITORING_POINT, payload: addedMonitoringPoint });
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteMachine = (id: number | null, userId: number | null) => {
  return async (dispatch: Dispatch<DeleteMachineAction>) => {
    try {
      const response = await axios.post(`/api/deleteMachine/${id}`, userId, {
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
