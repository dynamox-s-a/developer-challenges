import {
  loginController,
  logoutController,
} from "@/controller/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as actionTypes from "@/redux/auth/actionTypes";
import { getMe } from "../user/thunks";

export const login = createAsyncThunk(
  actionTypes.AUTH_LOGIN,
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      await loginController(email, password);

      const user = await dispatch(getMe()).unwrap();
      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "An error occurred during login");
    }
  },
);

export const logout = createAsyncThunk(
  actionTypes.AUTH_LOGOUT,
  async (_, { rejectWithValue }) => {
    try {
      await logoutController();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);