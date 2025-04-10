import { createSlice } from "@reduxjs/toolkit";
import { fetchSensors } from "./sensorThunks";
import { SensorModelType } from "./sensorTypes";

interface SensorState {
  items: SensorModelType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SensorState = {
  items: [],
  status: "idle",
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
        state.error = null;
      })
      .addCase(fetchSensors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchSensors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default sensorSlice.reducer;
