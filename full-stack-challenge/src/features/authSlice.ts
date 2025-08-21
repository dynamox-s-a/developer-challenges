import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated:
    typeof window !== "undefined" && Cookies.get("isAuthenticated") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
      Cookies.set("isAuthenticated", "true");
    },
    logout: (state) => {
      state.isAuthenticated = false;
      Cookies.remove("isAuthenticated");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
