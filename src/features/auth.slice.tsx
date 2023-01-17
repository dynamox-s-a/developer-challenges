import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, ResponseUserType } from "../types/index";
import { RootState } from "../app/store";

const initialState: AuthState = {
  email: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ResponseUserType>) => {
      state.email = action.payload.user.email;
      state.token = action.payload.accessToken;
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: action.payload.user.email,
          token: action.payload.accessToken,
        })
      );
    },
    logout: (state) => {
      localStorage.clear();
      state.email = null;
      state.token = null;
    },
  },
});

export const selectAuth = (state: RootState) => state.auth;

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
