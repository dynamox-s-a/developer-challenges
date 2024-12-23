import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { handleAsyncAction } from "@/utils/asyncSliceHelper";
import * as actionTypes from "@/redux/user/actionTypes";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    handleAsyncAction(builder, actionTypes.GET_ME, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    });

    handleAsyncAction(builder, actionTypes.CREATE_USER, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
  },
});

export const { resetError } = authSlice.actions;

export default authSlice.reducer;
