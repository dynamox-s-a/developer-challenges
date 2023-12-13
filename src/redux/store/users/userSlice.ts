import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UsersService } from "../../../services/api/users/UsersService";
import { FetchStatus } from "../../types";
import { IUser, IUserLogin, IUserState } from "./types";

const initialUsers: IUserState = {
  user: undefined,
  isLogged: false,
  status: FetchStatus.idle,
  error: undefined,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (user: IUserLogin) => {
    const response = await UsersService.getByEmail(user);
    return response.data[0];
  },
);

const userSlice = createSlice({
  name: "user",
  initialState: initialUsers,
  reducers: {
    logout: () => {
      return initialUsers;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, _action) => {
        state.status = FetchStatus.loading;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, { payload }: PayloadAction<IUser>) => {
          state.status = FetchStatus.succeeded;
          if (payload) {
            state.user = payload;
            state.isLogged = true;
          } else {
            state.error = "Usuário e/ou senha Incorretos";
          }
        },
      )
      .addCase(fetchUser.rejected, (state, { error }) => {
        state.status = FetchStatus.failed;
        state.error = error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
