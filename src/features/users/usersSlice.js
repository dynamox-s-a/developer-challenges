import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    postUser(state, action) {
      state.push(action.payload);
    }
  }
});

export const { postUser } = usersSlice.actions;
export default usersSlice.reducer;
