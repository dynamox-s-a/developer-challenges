import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getToken, setToken as setTokenToStorage, clearToken } from "../auth/token";

type AuthState = {
  token: string | null;
};

const initialState: AuthState = {
  token: getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      setTokenToStorage(action.payload);
    },
    logout(state) {
      state.token = null;
      clearToken();
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;