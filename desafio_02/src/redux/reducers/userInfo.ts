import { IUser, FetchUserInfo } from "../interfaces/IUser";
import { fetchUser } from "../helpers/fetchAPI";
import { createSlice } from "@reduxjs/toolkit";
import { useCreateAppAsyncThunk } from "../hooks/useCreateAppAsyncThunk";

export const fetchUserInfo = useCreateAppAsyncThunk(
  "userInfo/fetchUser",
  async (userInfo: FetchUserInfo, thunkAPI) => {
    const verifyUser = await fetchUser(userInfo.email);

    if (verifyUser === null) {
      return thunkAPI.rejectWithValue(
        "Usuário não encontrado, tente novamente"
      );
    }

    if (verifyUser.password !== userInfo.password) {
      return thunkAPI.rejectWithValue("Senha incorreta, tente novamente");
    }

    return verifyUser;
  }
);

const INITIAL_STATE: IUser = {
  email: "",
  password: "",
  token: "",
  loading: false,
};

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: INITIAL_STATE,
  reducers: {
    setUserEmail(state, action) {
      state.email = action.payload;
    },
    setUserPassword(state, action) {
      state.password = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.token = action.payload.token;
      state.loading = false;
    });
    builder.addCase(fetchUserInfo.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setUserEmail, setUserPassword } = userInfoSlice.actions;

export default userInfoSlice.reducer;
