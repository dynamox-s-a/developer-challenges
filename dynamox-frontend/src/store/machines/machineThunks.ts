import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../index";
import { Machine } from "./machineTypes";

export const fetchMachines = createAsyncThunk("machines/fetchMachines", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState() as RootState;
    const token = state.auth.token;

    const response = await axios.get("http://localhost:3000/machines", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Erro ao buscar máquinas");
  }
});

export const createMachine = createAsyncThunk(
  "machines/createMachine",
  async (data: Omit<Machine, "id">, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      const response = await axios.post("http://localhost:3000/machines", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // nova máquina criada
    } catch (error: any) {
      return thunkAPI.rejectWithValue("Erro ao criar máquina");
    }
  }
);

export const updateMachine = createAsyncThunk(
  "machines/updateMachine",
  async (data: Machine, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      const response = await axios.put(`http://localhost:3000/machines/${data.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao atualizar máquina");
    }
  }
);

export const deleteMachine = createAsyncThunk(
  "machines/deleteMachine",
  async (id: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.auth.token;

      await axios.delete(`http://localhost:3000/machines/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue("Erro ao excluir máquina");
    }
  }
);
