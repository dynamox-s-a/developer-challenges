import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserController, getMeController } from "@/controller/user";
import * as actionTypes from "@/redux/user/actionTypes";

export const getMe = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getMeController();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const createUser = createAsyncThunk(
  actionTypes.CREATE_USER,
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      return await createUserController(email, password);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);
