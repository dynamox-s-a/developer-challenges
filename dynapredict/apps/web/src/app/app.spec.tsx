import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { api } from '../lib/api-client';
import { tokenStorage } from '../lib/token-storage';
import App from './app';
import { setupStore } from './store';

const user = { id: 'user-1', email: 'admin@dynamox.com' };

const point = {
  id: 'point-1',
  name: 'Mancal LA',
  machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
  sensor: null,
};

const series = {
  id: 'series-1',
  name: 'Temperatura',
  unit: '°C',
  sensorSerialNumber: 'DyL4.01.A0001',
  monitoringPointId: 'point-1',
  sampleCount: 1,
  startedAt: '2026-11-22T10:00:00.000Z',
  endedAt: '2026-11-22T10:00:00.000Z',
  createdAt: '2026-11-22T11:00:00.000Z',
  samples: [{ timestamp: '2026-11-22T10:00:00.000Z', value: 31.5 }],
};

const metrics = {
  count: 1,
  min: 31.5,
  max: 31.5,
  mean: 31.5,
  stdDev: 0,
  rms: 31.5,
};

// Renderiza o App como se o navegador estivesse na URL "path".
// Por padrão entra logado e espera o app descobrir quem é o usuário;
// use { loggedIn: false } para simular um visitante
async function renderApp(path: string, { loggedIn = true } = {}) {
  if (loggedIn) {
    tokenStorage.set('token-de-teste');
    // API de mentira: o porteiro pergunta "quem é você?" (/auth/me), e as
    // páginas pedem as listas, que aqui vêm vazias. A de pontos vem em
    // páginas, por isso a resposta dela tem outro formato. E a página de um
    // ponto pede o ponto (o point-1), e a de uma série, a série e as
    // métricas (da series-1)
    vi.spyOn(api, 'get').mockImplementation(async (url) => {
      if (url === '/auth/me') {
        return { data: { user } };
      }
      if (url === '/monitoring-points') {
        return { data: { items: [], total: 0, page: 1, pageSize: 5 } };
      }
      if (url === '/monitoring-points/point-1') {
        return { data: point };
      }
      if (url === '/time-series/series-1') {
        return { data: series };
      }
      if (url === '/time-series/series-1/metrics') {
        return { data: metrics };
      }
      return { data: [] };
    });
  }

  const result = render(
    <Provider store={setupStore()}>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </MemoryRouter>
    </Provider>,
  );

  if (loggedIn) {
    // Espera a resposta do /me chegar (o e-mail aparece na barra do topo)
    await screen.findByText(user.email);
  }

  return result;
}

describe('App', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it('should render successfully', async () => {
    const { baseElement } = await renderApp('/machines');
    expect(baseElement).toBeTruthy();
  });

  it('should redirect "/" to the machines page', async () => {
    await renderApp('/');
    expect(screen.getByRole('heading', { name: 'Máquinas' })).toBeTruthy();
  });

  it('should open the monitoring points page', async () => {
    await renderApp('/monitoring-points');
    expect(
      screen.getByRole('heading', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();
  });

  it('should open the page of a monitoring point', async () => {
    await renderApp('/monitoring-points/point-1');
    expect(
      await screen.findByRole('heading', { name: 'Mancal LA' }),
    ).toBeTruthy();
  });

  it('should open the page of a time series', async () => {
    await renderApp('/time-series/series-1');
    expect(
      await screen.findByRole('heading', { name: 'Temperatura (°C)' }),
    ).toBeTruthy();
  });

  it('should navigate using the side menu', async () => {
    await renderApp('/machines');

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

  it('should show the login page without the side menu', async () => {
    await renderApp('/login', { loggedIn: false });

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(screen.queryByRole('navigation')).toBeNull();
  });

  it('should send a visitor without login to the login page', async () => {
    await renderApp('/machines', { loggedIn: false });

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Máquinas' })).toBeNull();
  });

  it('should go back to the requested page after the login', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { token: 'token-novo', user },
    });
    await renderApp('/monitoring-points', { loggedIn: false });

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
    await renderApp('/machines');

    fireEvent.click(screen.getByRole('button', { name: 'Sair' }));

    expect(await screen.findByRole('button', { name: 'Entrar' })).toBeTruthy();
    expect(tokenStorage.get()).toBeNull();
  });

  it('should ask the api who is logged in and show the e-mail', async () => {
    await renderApp('/machines');

    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(screen.getByText('admin@dynamox.com')).toBeTruthy();
  });
});
