import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MonitoringPoint } from "./monitoringPointTypes";

export const fetchMonitoringPoints = createAsyncThunk<
  MonitoringPoint[],
  void,
  { rejectValue: string }
>("monitoringPoints/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get("/api/monitoring-point");
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Erro ao buscar pontos de monitoramento"
    );
  }
});
