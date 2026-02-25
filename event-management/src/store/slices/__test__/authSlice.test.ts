import { setUser, logout } from '../authSlice';
import authReducer from '../authSlice';
import { makeStore } from '@/store';
import { login } from '../authSlice';

jest.mock('@/services/authService', () => ({
  loginUser: jest.fn(),
}));

import { loginUser } from '@/services/authService';

describe('authSlice reducers', () => {
  it('should setUser', () => {
    const previousState = {
      user: {
        email: '',
        role: '',
      },
      loading: false,
      error: '',
    };
    const user = { email: 'teste@teste.com', role: 'teste' };
    expect(authReducer(previousState, setUser(user))).toEqual({ ...previousState, user });
  });

  it('should logout user', () => {
    const previousState = {
      user: {
        email: 'teste@teste.com',
        role: 'teste',
      },
      loading: false,
      error: '',
    };
    expect(authReducer(previousState, logout())).toEqual({ ...previousState, user: { email: '', role: '' } });
  });
});

describe('authSlice login flow', () => {
  it('should handle login success', async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      user: { email: 'teste@teste.com', role: 'teste' },
      token: 'token',
    });
    const store = makeStore();

    await store.dispatch(login({ email: 'teste@teste.com', password: 'teste' }));
    expect(store.getState().auth).toEqual({
      user: { email: 'teste@teste.com', role: 'teste' },
      loading: false,
      error: '',
    });
  });

  it('should handle login failure', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error('Credenciais inválidas'));
    const store = makeStore();

    await store.dispatch(login({ email: 'teste@teste.com', password: 'teste' }));
    expect(store.getState().auth).toEqual({
      user: { email: '', role: '' },
      loading: false,
      error: 'Credenciais inválidas',
    });
  });

  it('should handle login error with default message', async () => {
    (loginUser as jest.Mock).mockRejectedValue(new Error(''));
    const store = makeStore();

    await store.dispatch(login({ email: 'teste@teste.com', password: 'teste' }));
    expect(store.getState().auth).toEqual({
      user: { email: '', role: '' },
      loading: false,
      error: 'Erro ao fazer login',
    });
  });
});
