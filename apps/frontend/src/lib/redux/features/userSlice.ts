import { User } from "@prisma/client";
import { api } from '../../../services/api';
import { createListenerMiddleware, createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";

const getUserLocalStorage = () => {
  const rawUser = typeof window !== "undefined"
    ? localStorage.getItem('@dynamox-challenge:user')
    : null;
  return rawUser ? JSON.parse(rawUser) as User : null;
}

const setUserLocalStorage = (user: User) => {
  localStorage.setItem('@dynamox-challenge:user', JSON.stringify(user));
};

const removeUserLocalStorage = () => {
  localStorage.removeItem('@dynamox-challenge:user');
}

const getAccessTokenLocalStorage = () => {
  return typeof window !== "undefined"
    ? localStorage.getItem('@dynamox-challenge:accessToken')
    : null;
};

const setAccessTokenLocalStorage = (accessToken: string) => {
  localStorage.setItem('@dynamox-challenge:accessToken', accessToken);
};

const removeAccessTokenLocalStorage = () => {
  localStorage.removeItem('@dynamox-challenge:accessToken');
};

const getInitialState = () => (): { user: User | null, accessToken: string | null } => {
  const user = getUserLocalStorage();
  const accessToken = getAccessTokenLocalStorage();
  return { user, accessToken };
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    login: (state, action: PayloadAction<{ user: User, accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      api.defaults.headers.common['Authorization'] = `Bearer ${action.payload.accessToken}`;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      api.defaults.headers.common['Authorization'] = undefined;
    }
  },
});

export const { setUser, setAccessToken, login, logout } = userSlice.actions;
export default userSlice.reducer;

const userMiddleware = createListenerMiddleware();

userMiddleware.startListening({
  matcher: isAnyOf(login, logout, setUser, setAccessToken),
  effect: (action, store) => {
    if (login.match(action)) {
      setUserLocalStorage(action.payload.user);
      setAccessTokenLocalStorage(action.payload.accessToken);
    } else if (logout.match(action)) {
      removeUserLocalStorage();
      removeAccessTokenLocalStorage();
    } else if (setUser.match(action)) {
      setUserLocalStorage(action.payload);
    } else if (setAccessToken.match(action)) {
      setAccessTokenLocalStorage(action.payload);
    }
  }
});

export { userMiddleware };
