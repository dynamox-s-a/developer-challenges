import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../index";
import { SensorModelType } from "./sensorTypes";

export const fetchSensors = createAsyncThunk<SensorModelType[]>(
  "sensors/fetchSensors",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      const response = await axios.get("http://localhost:3000/sensor-models", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data as SensorModelType[];
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao buscar sensores");
    }
  }
);
