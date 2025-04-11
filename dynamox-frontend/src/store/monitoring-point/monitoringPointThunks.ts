import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { MonitoringPoint, UpdateMonitoringPointDTO } from "./monitoringPointTypes";
import { RootState } from "../index";
import { toDbModel, fromDbModel } from "../../utils/sensorModelUtils";

export const fetchMonitoringPoints = createAsyncThunk<
  MonitoringPoint[],
  void,
  { rejectValue: string }
>("monitoringPoints/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axios.get(
      "http://dynapredict.us-east-1.elasticbeanstalk.com/monitoring-points"
    );
    return response.data.map((point: MonitoringPoint) => ({
      ...point,
      sensorModel: fromDbModel(point.sensorModel),
    }));
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
    const payload = {
      ...data,
      sensorModel: toDbModel(data.sensorModel),
    };
    const response = await axios.post(
      "http://dynapredict.us-east-1.elasticbeanstalk.com/monitoring-points",
      payload
    );
    return {
      ...response.data,
      sensorModel: fromDbModel(response.data.sensorModel),
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Erro ao criar ponto de monitoramento"
    );
  }
});

export const updateMonitoringPoint = createAsyncThunk<
  MonitoringPoint,
  UpdateMonitoringPointDTO,
  { rejectValue: string }
>("monitoring-points/updateMonitoringPoint", async (data, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const token = state.auth.token;

    const payload = {
      ...data,
      sensorModel: toDbModel(data.sensorModel),
    };

    const response = await axios.put(
      `http://dynapredict.us-east-1.elasticbeanstalk.com/monitoring-points/${data.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      ...response.data,
      sensorModel: fromDbModel(response.data.sensorModel),
    };
  } catch (error) {
    return thunkAPI.rejectWithValue("Erro ao atualizar ponto de monitoramento");
  }
});

export const deleteMonitoringPoint = createAsyncThunk<string, string, { rejectValue: string }>(
  "monitoring-points/deleteMonitoringPoint",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      await axios.delete(
        `http://dynapredict.us-east-1.elasticbeanstalk.com/monitoring-points/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao excluir ponto de monitoramento");
    }
  }
);
