import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MonitoringPoint } from "./monitoringPointTypes";
import { RootState } from "../index";
import { UpdateMonitoringPointDTO } from "./monitoringPointTypes";

export const fetchMonitoringPoints = createAsyncThunk<
  MonitoringPoint[],
  void,
  { rejectValue: string }
>("monitoringPoints/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:3000/monitoring-points");
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data || "Erro ao buscar pontos de monitoramento"
    );
  }
});

interface CreateMonitoringPointInput {
  name: string;
  machineId: string;
  sensorModel: string;
}

export const createMonitoringPoint = createAsyncThunk<
  MonitoringPoint,
  CreateMonitoringPointInput,
  { rejectValue: string }
>("monitoringPoints/create", async (data, thunkAPI) => {
  try {
    const response = await axios.post("http://localhost:3000/monitoring-points", data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Erro ao criar ponto de monitoramento"
    );
  }
});
interface CreateMonitoringPointInput {
  name: string;
  machineId: string;
  sensorModel: string;
}

export const updateMonitoringPoint = createAsyncThunk(
  "monitoring-points/updateMonitoringPoint",
  async (data: UpdateMonitoringPointDTO, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      const response = await axios.put(
        `http://localhost:3000/monitoring-points/${data.id}`,
        {
          name: data.name,
          machineId: data.machineId,
          sensorModel: data.sensorModel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao atualizar ponto de monitoramento");
    }
  }
);

export const deleteMonitoringPoint = createAsyncThunk(
  "monitoring-points/deleteMonitoringPoint",
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      await axios.delete(`http://localhost:3000/monitoring-points/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao excluir ponto de monitoramento");
    }
  }
);
