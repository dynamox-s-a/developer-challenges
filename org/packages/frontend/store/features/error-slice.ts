import { createSlice } from '@reduxjs/toolkit';

import { loginUser } from './user-slice';

type ErrorType = {
  loginUser?: string;
};

const INITIAL_STATE: ErrorType = {
  loginUser: undefined,
};
export const errorSlice = createSlice({
  name: 'error',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.loginUser = '';
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loginUser = '';
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loginUser = action.payload as string;
    });
  },
});

export default errorSlice.reducer;
