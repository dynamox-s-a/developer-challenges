import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../index";
import { CreateSensorDTO, UpdateSensorDTO } from "./sensorTypes";

export const fetchSensors = createAsyncThunk("sensors/fetchSensors", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const token = state.auth.token;

    const response = await axios.get("http://localhost:3000/sensors", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Erro ao buscar sensores");
  }
});

export const createSensor = createAsyncThunk(
  "sensors/createSensor",
  async (data: CreateSensorDTO, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post("http://localhost:3000/sensors", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Erro ao criar sensor");
    }
  }
);

export const updateSensor = createAsyncThunk(
  "sensors/updateSensor",
  async (data: UpdateSensorDTO, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      const response = await axios.put(`http://localhost:3000/sensors/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao atualizar sensor");
    }
  }
);

export const deleteSensor = createAsyncThunk(
  "sensors/deleteSensor",
  async (id: number, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      await axios.delete(`http://localhost:3000/sensors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao excluir sensor");
    }
  }
);
