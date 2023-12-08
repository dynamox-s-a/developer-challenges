import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IMonitoringPoint, IMonitoringPointsState } from "./types";

const initialMonitoringPoints: IMonitoringPointsState = {
  monitoringPoints: [],
  error: false,
  loading: false,
};

const monitoringPointsSlice = createSlice({
  name: "monitoringPoints",
  initialState: initialMonitoringPoints,
  reducers: {
    setMonitoringPoints: (
      state,
      { payload }: PayloadAction<IMonitoringPoint[]>,
    ) => {
      return { ...state, monitoringPoints: payload };
    },
    createMonitoringPoint: (
      state,
      { payload }: PayloadAction<IMonitoringPoint>,
    ) => {
      return {
        ...state,
        monitoringPoints: [...state.monitoringPoints, payload],
      };
    },
    updateMonitoringPoint: (
      state,
      { payload }: PayloadAction<IMonitoringPoint>,
    ) => {
      const { id, name, machineName, machineType, sensor } = payload;
      state.monitoringPoints
        .filter((point) => point.id === id)
        .map((point) => {
          point.name = name;
          point.machineName = machineName;
          point.machineType = machineType;
          point.sensor = sensor;
        });
    },
    deleteMonitoringPoint: (
      state,
      { payload }: PayloadAction<IMonitoringPoint>,
    ) => {
      state.monitoringPoints.filter((point) => point.id !== payload.id);
    },
  },
});

export const {
  setMonitoringPoints,
  createMonitoringPoint,
  updateMonitoringPoint,
  deleteMonitoringPoint,
} = monitoringPointsSlice.actions;

export const getMonitoringPoints = (state: {
  monitoringPoint: IMonitoringPoint;
}) => state.monitoringPoint;

export default monitoringPointsSlice.reducer;
