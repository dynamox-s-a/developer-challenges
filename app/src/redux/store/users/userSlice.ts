import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser, IUserState } from "./types";

const initialUsers: IUserState = {
  user: undefined,
  isLogged: false,
  error: false,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUsers,
  reducers: {
    setUser: (state, { payload }: PayloadAction<IUser>) => {
      return { ...state, user: payload };
    },
    userStatus: (state, { payload }: PayloadAction<boolean>) => {
      return { ...state, isLogged: payload };
    },
  },
});

export const { setUser, userStatus } = userSlice.actions;

export const getUsers = (state: { machine: IUser }) => state.machine;

export default userSlice.reducer;
