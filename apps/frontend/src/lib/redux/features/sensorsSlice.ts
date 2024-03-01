import {
  getSensor,
  getSensors,
  deleteSensor,
  createSensor,
  updateSensor as updateSensorApi,
 } from '../../api';
import { Sensor } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SensorsSliceState {
  data: Sensor[];
  status: "ready" | "loading" | "error";
}

const initialState: SensorsSliceState = {
  data: [],
  status: "ready",
};

const sensorsSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addSensor: (state, action: PayloadAction<Sensor>) => {
      state.data = state.data.concat(action.payload);
    },
    removeSensor: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((sensor) => sensor.id !== action.payload);
    },
    updateSensor: (state, action: PayloadAction<Sensor>) => {
      state.data = state.data.map((sensor) => {
        if (sensor.id === action.payload.id) {
          return action.payload;
        }
        return sensor;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSensors.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getSensors.fulfilled, (state, action) => {
      state.status = "ready";
      state.data = action.payload as Sensor[];
    });
    builder.addCase(getSensors.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(createSensor.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createSensor.fulfilled, (state, action) => {
      state.data = state.data.concat(action.payload as Sensor);
      state.status = "ready";
    });
    builder.addCase(createSensor.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(updateSensorApi.fulfilled, (state, action) => {
      state.data = state.data.map((sensor) => {
        if (sensor.id === (action.payload as Sensor).id) {
          return action.payload;
        }
        return sensor;
      }) as Sensor[];
      state.status = "ready";
    });
    builder.addCase(updateSensorApi.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(updateSensorApi.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(deleteSensor.fulfilled, (state, action) => {
      state.data = state.data.filter((sensor) => sensor.id !== action.payload);
      state.status = "ready";
    });
    builder.addCase(deleteSensor.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(deleteSensor.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getSensor.fulfilled, (state, action) => {
      state.status = "ready";
    });
    builder.addCase(getSensor.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(getSensor.pending, (state) => {
      state.status = "loading";
    });
  },
});

export const { addSensor, removeSensor, updateSensor } = sensorsSlice.actions;
export default sensorsSlice.reducer;
