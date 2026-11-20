import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { api } from '../../lib/api-client';
import { tokenStorage } from '../../lib/token-storage';
import { authReducer } from './auth.slice';
import { LoginPage } from './login-page';

// Abre a tela de login com uma store nova. A rota /machines é só um
// marcador para sabermos que o redirecionamento aconteceu
function renderLoginPage() {
  const store = configureStore({ reducer: { auth: authReducer } });

  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={['/login']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/machines" element={<h1>Página de máquinas</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

// Preenche o formulário e clica em "Entrar"
function submit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('E-mail'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText('Senha'), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

describe('LoginPage', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('should show the field errors and not call the api when the form is invalid', () => {
    const post = vi.spyOn(api, 'post');
    renderLoginPage();

    submit('email-sem-arroba', '');

    expect(screen.getByText('Informe um e-mail válido')).toBeTruthy();
    expect(screen.getByText('Informe a senha')).toBeTruthy();
    expect(post).not.toHaveBeenCalled();
  });

  it('should go to the machines page when the login succeeds', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        token: 'token-novo',
        user: { id: 'user-1', email: 'admin@dynamox.com' },
      },
    });
    renderLoginPage();

    submit('admin@dynamox.com', 'dynapredict123');

    expect(
      await screen.findByRole('heading', { name: 'Página de máquinas' }),
    ).toBeTruthy();
  });

  it('should show the api error message when the login fails', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 401,
      data: {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'E-mail ou senha inválidos',
        },
      },
    } as AxiosResponse;
    vi.spyOn(api, 'post').mockRejectedValue(error);
    renderLoginPage();

    submit('admin@dynamox.com', 'senha-errada');

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('E-mail ou senha inválidos')).toBeTruthy();
  });

  it('should skip the login page when the user is already logged in', () => {
    tokenStorage.set('token-salvo');

    renderLoginPage();

    expect(
      screen.getByRole('heading', { name: 'Página de máquinas' }),
    ).toBeTruthy();
  });
});