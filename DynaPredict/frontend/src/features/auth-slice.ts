import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authClient, type UserParams } from "../services/auth-client";

const initialState = {
  access_token: localStorage.getItem("access_token") || "",
  refresh_token: localStorage.getItem("refresh_token") || "",
  isLogged: (() => {
    try {
      if (typeof window === "undefined") return false;
      const token = localStorage.getItem("access_token");
      return Boolean(token);
    } catch {
      return false;
    }
  })(),
  error: null as string | null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (user: UserParams, { rejectWithValue }) => {
    const response = await authClient.login(user);
    console.log(
      "loginUser response:",
      response.access_token,
      response.refresh_token
    );
    if (response.error) return rejectWithValue(response.error);
    return {
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      authClient.logout();
      return { ...state, isLogged: false, access_token: "", refresh_token: "" };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLogged = action.payload.access_token ? true : false;
      state.access_token = action.payload.access_token ?? "";
      state.refresh_token = action.payload.refresh_token ?? "";
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLogged = false;
      state.access_token = "";
      state.refresh_token = "";
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export const selectUser = (state: { user: any; }) => state.user;
export default authSlice.reducer;
