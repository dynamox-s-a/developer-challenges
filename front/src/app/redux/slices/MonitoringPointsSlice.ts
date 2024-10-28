"use client";
import Sensor from "@/app/routes/monitoringPoints/components/Sensor";
import MonitoringPointsService from "@/app/services/MonitoringPoints/MonitoringPointsService";
import Machine from "@/app/types/Machine";
import MonitoringPoints from "@/app/types/MonitoringPoints";
/* eslint-disable react-hooks/rules-of-hooks */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  monitoringPoints: MonitoringPoints[];
  monitoringPoint: {
    id: number;
    name: string;
    machine: Machine;
    sensor: Sensor;
  };
}

export const initialState: InitialState = {
  monitoringPoints: [],
  monitoringPoint: {
    name: "",
    sensor: {
      id: 0,
      modelName: "",
    },
    machine: { name: "", type: "", id: 0 },
    id: 0,
  },
};

const slice = createSlice({
  name: "monitoringPointsReducer",
  initialState,
  reducers: {
    setMonitoringPoints: (state, action: PayloadAction<MonitoringPoints[]>) => {
      state.monitoringPoints = action.payload;
    },
    setMonitoringPoint: (state, action: PayloadAction<any>) => {
      state.monitoringPoint = action.payload;
    },
    reset: (state) => {
      state = initialState;
      return state;
    },
  },
});

export default slice.reducer;
export const { setMonitoringPoints, setMonitoringPoint } = slice.actions;

export function getMonitoringPoints() {
  return async (dispatch: any) => {
    try {
      const response = await MonitoringPointsService.getAllMonitoringPoints();
      if (response.status === 200) {
        dispatch(setMonitoringPoints(response.data.monitoringPoints));
      } else {
        throw new Error("Failed to get all monitoring points. Verify.");
      }
    } catch (error) {
      console.error("Error fetching monitoring points:", error);
    }
  };
}

export function getMonitoringPointById(id: number) {
  return async (dispatch: any) => {
    try {
      const response = await MonitoringPointsService.getMonitoringPointById(id);
      if (response.status === 200) {
        dispatch(setMonitoringPoint(response.data.monitoringPoint));
      } else {
        throw new Error("Failed to get the monitoring point. Verify.");
      }
    } catch (error) {
      console.error("Error fetching the monitoring point:", error);
    }
  };
}
