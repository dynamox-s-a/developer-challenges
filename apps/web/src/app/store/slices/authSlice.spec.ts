import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, logout } from './authSlice';

const createStore = () =>
  configureStore({
    reducer: { auth: authReducer },
  });

describe('authSlice', () => {
  it('initial state is not authenticated', () => {
    const store = createStore();
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });

  it('logout clears auth state', () => {
    const store = createStore();
    store.dispatch(
      logout()
    );
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.user).toBeNull();
  });
});
