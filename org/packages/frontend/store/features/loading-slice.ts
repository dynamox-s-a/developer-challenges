import { createSlice } from '@reduxjs/toolkit';

import { loginUser } from './user-slice';

type LoadingType = {
  loginUser?: boolean;
};

const INITIAL_STATE: LoadingType = {
  loginUser: undefined,
};
export const loadingSlice = createSlice({
  name: 'loading',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state) => {
      state.loginUser = false;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loginUser = false;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loginUser = true;
    });
  },
});

export default loadingSlice.reducer;
