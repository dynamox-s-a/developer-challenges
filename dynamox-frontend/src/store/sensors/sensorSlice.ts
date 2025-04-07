import { createSlice } from "@reduxjs/toolkit";
import { fetchSensors, createSensor, updateSensor, deleteSensor } from "./sensorThunks";
import { Sensor } from "./sensorTypes";

interface SensorState {
  sensors: Sensor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  loading: boolean;
  error: string | null;
}

const initialState: SensorState = {
  sensors: [],
  status: "idle",
  loading: false,
  error: null,
};

const sensorSlice = createSlice({
  name: "sensors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSensors.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.sensors = action.payload;
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createSensor.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(createSensor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.sensors.push(action.payload);
      })
      .addCase(createSensor.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateSensor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        const index = state.sensors.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.sensors[index] = action.payload;
        }
      })

      .addCase(deleteSensor.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.sensors = state.sensors.filter((s) => s.id !== action.payload);
      });
  },
});

export default sensorSlice.reducer;
