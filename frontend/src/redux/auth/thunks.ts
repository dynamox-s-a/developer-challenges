import { loginController, logoutController } from "@/controller/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as actionTypes from "@/redux/auth/actionTypes";
import { getMe } from "../user/thunks";
import { fetchMachines } from "../machines/thunks";

/**
 * Async action to handle user login.
 * @param {string} param.email - The user's email.
 * @param {string} param.password - The user's password.
 * @returns {Promise<User>} - Returns the user object upon successful login.
 */
export const login = createAsyncThunk(
  actionTypes.AUTH_LOGIN,
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      await loginController(email, password);

      // Fetch current user and machine data
      const user = await dispatch(getMe()).unwrap();
      await dispatch(fetchMachines()).unwrap();
      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "An error occurred during login");
    }
  },
);

/**
 * Async action to handle user logout.
 * @returns {Promise<void>} - Resolves on successful logout.
 */
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

/**
 * Async action to check if the user is authenticated.
 * @returns {Promise<User>} - Returns the user object if authentication is successful.
 */
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    try {
      const user = await dispatch(getMe()).unwrap();
      return user;
    } catch (error) {
      throw error;
    }
  }
);