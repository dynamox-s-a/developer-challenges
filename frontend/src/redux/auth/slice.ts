import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/user";
import { handleAsyncAction } from "@/utils/asyncSliceHelper";
import * as actionTypes from "@/redux/auth/actionTypes";

/**
 * The initial state of the authentication slice.
 * @property {User | null} user - The current authenticated user, or null if not authenticated.
 * @property {boolean} isLoading - Flag indicating if the authentication request is in progress.
 * @property {string | null} error - Error message, if any, related to authentication.
 * @property {boolean} isAuthenticated - Flag indicating if the user is authenticated.
 */
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * The initial state of the authentication slice.
 */
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

/**
 * Redux slice for managing authentication state.
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Action to reset the error state.
     */
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /**
     * Handles async actions for login and logout.
     * Uses `handleAsyncAction` to handle the corresponding action types.
     */
    handleAsyncAction(builder, actionTypes.AUTH_LOGIN, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });

    handleAsyncAction(builder, actionTypes.AUTH_LOGOUT, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

/**
 * Action to reset the error state.
 * @returns {Object} - The action to reset the error state.
 */
export const { resetError } = authSlice.actions;

/**
 * The reducer function to handle authentication actions.
 */
export default authSlice.reducer;
