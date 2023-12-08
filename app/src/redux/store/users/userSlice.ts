import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersService } from "../../../services/api/users/UsersService";
import { FetchStatus } from "../../types";
import { RootState } from "..";
import { IUser, IUserLogin, IUserState } from "./types";

const initialUsers: IUserState = {
  user: undefined,
  isLogged: false,
  status: FetchStatus.idle,
  error: undefined,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async ({ email, password }: IUserLogin) => {
    const response = await UsersService.getByEmail(email, password);
    return response.data[0];
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: initialUsers,
  reducers: {
    setUser: (state, { payload }: PayloadAction<IUser>) => {
      return { ...state, user: payload, isLogged: true };
    },
    clearUser: () => {
      return initialUsers;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        state.status = FetchStatus.loading;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, { payload }: PayloadAction<IUser>) => {
          state.status = FetchStatus.succeeded;
          state.user = payload;
          state.isLogged = true;
        },
      )
      .addCase(fetchUser.rejected, (state, { error }) => {
        state.status = FetchStatus.failed;
        state.error = error.message;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const getUser = (state: RootState) => state.user.user;
export const getUsersStatus = (state: RootState) => state.user.status;
export const getUsersError = (state: RootState) => state.user.error;
export default userSlice.reducer;
