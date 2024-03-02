import {
  getMonitoringPoint,
  getMonitoringPoints,
  deleteMonitoringPoint,
  createMonitoringPoint,
  updateMonitoringPoint as updateMonitoringPointApi,
 } from '../../api';
import { MonitoringPoint } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MachinesSliceState {
  data: MonitoringPoint[];
  openEditModal: boolean;
  monitoringPointSelected: MonitoringPoint | null;
  status: "ready" | "loading" | "error";
}

const initialState: MachinesSliceState = {
  data: [],
  status: "ready",
  openEditModal: false,
  monitoringPointSelected: null,
};

const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    addMonitoringPoint: (state, action: PayloadAction<MonitoringPoint>) => {
      state.data = state.data.concat(action.payload);
    },
    removeMonitoringPoint: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((monitoringPoint) => monitoringPoint.id !== action.payload);
    },
    updateMonitoringPoint: (state, action: PayloadAction<MonitoringPoint>) => {
      state.data = state.data.map((monitoringPoint) => {
        if (monitoringPoint.id === action.payload.id) {
          return action.payload;
        }
        return monitoringPoint;
      });
    },
    selectMonitoringPoint: (state, action: PayloadAction<MonitoringPoint | null>) => {
      state.monitoringPointSelected = action.payload;
      state.openEditModal = !state.openEditModal;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMonitoringPoints.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getMonitoringPoints.fulfilled, (state, action) => {
      state.status = "ready";
      state.data = action.payload as MonitoringPoint[];
    });
    builder.addCase(getMonitoringPoints.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(createMonitoringPoint.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createMonitoringPoint.fulfilled, (state, action) => {
      state.data = state.data.concat(action.payload as MonitoringPoint);
      state.status = "ready";
    });
    builder.addCase(createMonitoringPoint.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(updateMonitoringPointApi.fulfilled, (state, action) => {
      state.data = state.data.map((monitoringPoint) => {
        if (monitoringPoint.id === (action.payload as unknown as MonitoringPoint).id) {
          return action.payload;
        }
        return monitoringPoint;
      }) as MonitoringPoint[];
      state.status = "ready";
    });
    builder.addCase(updateMonitoringPointApi.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateMonitoringPointApi.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(deleteMonitoringPoint.fulfilled, (state, action) => {
      state.data = state.data.filter((monitoringPoint) => monitoringPoint.id !== action.payload);
      state.status = "ready";
    });
    builder.addCase(deleteMonitoringPoint.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(deleteMonitoringPoint.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getMonitoringPoint.fulfilled, (state, action) => {
      state.status = "ready";
    });
    builder.addCase(getMonitoringPoint.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(getMonitoringPoint.pending, (state) => {
      state.status = "loading";
    });
  },
});

export const {
  addMonitoringPoint,
  removeMonitoringPoint,
  updateMonitoringPoint,
  selectMonitoringPoint,
} = machinesSlice.actions;
export default machinesSlice.reducer;
