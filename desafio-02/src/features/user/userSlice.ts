import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { login } from "./userAPI";

export interface User {
  name: string;
  age: number;
  jwt: string;
}

export interface UserState {
  status: "logging" | "logged-in" | "logged-out";
  data?: User;
}

const initialState: UserState = {
  status: "logged-out",
  data: undefined,
};

export const loginAsync = createAsyncThunk(
  "user/login",
  async ({ username, password }: { username: string; password: string }) => {
    if (username === "usuario" && password === "1234")
      return await login();
    else throw Error("invalid login");
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = "logged-out";
      state.data = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.status = "logging";
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "logged-in";
        state.data = action.payload;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.status = "logged-out";
        state.data = undefined;
      });
  },
});

export const { logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
