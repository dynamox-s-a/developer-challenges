import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { api } from '../lib/api-client';
import { tokenStorage } from '../lib/token-storage';
import App from './app';
import { setupStore } from './store';

// Renderiza o App como se o navegador estivesse na URL "path".
// Por padrão entra logado; use { loggedIn: false } para simular um visitante
function renderApp(path: string, { loggedIn = true } = {}) {
  if (loggedIn) {
    tokenStorage.set('token-de-teste');
  }

  return render(
    <Provider store={setupStore()}>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </Provider>,
  );
}

describe('App', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('should render successfully', () => {
    const { baseElement } = renderApp('/machines');
    expect(baseElement).toBeTruthy();
  });

  it('should redirect "/" to the machines page', async () => {
    renderApp('/');
    expect(
      await screen.findByRole('heading', { name: 'Máquinas' }),
    ).toBeTruthy();
  });

  it('should open the monitoring points page', () => {
    renderApp('/monitoring-points');
    expect(
      screen.getByRole('heading', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();
  });

  it('should navigate using the side menu', async () => {
    renderApp('/machines');

    // O menu existe duas vezes (celular e computador): clicamos no primeiro
    const [link] = screen.getAllByRole('link', {
      name: 'Pontos de monitoramento',
      hidden: true,
    });
    fireEvent.click(link);

    expect(
      await screen.findByRole('heading', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();
  });

  it('should show the login page without the side menu', () => {
    renderApp('/login', { loggedIn: false });

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('should send a visitor without login to the login page', () => {
    renderApp('/machines', { loggedIn: false });

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Máquinas' })).toBeNull();
  });

  it('should go back to the requested page after the login', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        token: 'token-novo',
        user: { id: 'user-1', email: 'admin@dynamox.com' },
      },
    });
    renderApp('/monitoring-points', { loggedIn: false });

    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'admin@dynamox.com' },
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'dynapredict123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(
      await screen.findByRole('heading', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();
  });

  it('should log out and go back to the login page', async () => {
    renderApp('/machines');

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(tokenStorage.get()).toBeNull();
  });
});
