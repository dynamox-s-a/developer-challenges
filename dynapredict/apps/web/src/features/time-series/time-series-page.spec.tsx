import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import {
  fetchTimeSeriesDetails,
  type TimeSeriesDetails,
  type TimeSeriesMetrics,
} from './time-series-details.slice';
import { TimeSeriesPage } from './time-series-page';

const series: TimeSeriesDetails = {
  id: 'series-1',
  name: 'Temperatura',
  unit: '°C',
  sensorSerialNumber: 'DyL4.01.A0001',
  monitoringPointId: 'point-1',
  sampleCount: 3,
  startedAt: '2026-11-22T10:00:00.000Z',
  endedAt: '2026-11-22T10:20:00.000Z',
  createdAt: '2026-11-22T11:00:00.000Z',
  samples: [
    { timestamp: '2026-11-22T10:00:00.000Z', value: 31.5 },
    { timestamp: '2026-11-22T10:10:00.000Z', value: 32 },
    { timestamp: '2026-11-22T10:20:00.000Z', value: 33 },
  ],
};

const metrics: TimeSeriesMetrics = {
  count: 3,
  min: 31.5,
  max: 33,
  mean: 32.166666,
  stdDev: 0.62361,
  rms: 32.172708,
};

// A API falsa: as métricas numa URL, e a série na outra
function mockApi(answer = { series, metrics }) {
  vi.spyOn(api, 'get').mockImplementation(async (url) =>
    url.endsWith('/metrics')
      ? { data: answer.metrics }
      : { data: answer.series },
  );
}

// Marcador da página de um ponto: mostra o id que veio na URL
function PointPageMarker() {
  const { id } = useParams();
  return <h1>Página do ponto {id}</h1>;
}

function renderPage(store = setupStore(), path = '/time-series/series-1') {
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/time-series/:id" element={<TimeSeriesPage />} />
          <Route path="/monitoring-points/:id" element={<PointPageMarker />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

// O valor mostrado no cartão de uma métrica, ex.: metric('Média')
function metric(label: string) {
  const card = screen.getByRole('group', { name: label });
  return within(card).getByRole('heading').textContent;
}

describe('TimeSeriesPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show the series, its metrics and the chart', async () => {
    mockApi();
    renderPage();

    expect(screen.getByLabelText('Carregando a série')).toBeTruthy();
    expect(
      await screen.findByRole('heading', { name: 'Temperatura (°C)' }),
    ).toBeTruthy();
    // O período no fuso de quem usa, como o navegador formata
    const startedAt = new Date(series.startedAt).toLocaleString('pt-BR');
    expect(screen.getByText(new RegExp(`De ${startedAt}`))).toBeTruthy();
    expect(screen.getByText(/Sensor DyL4\.01\.A0001/)).toBeTruthy();

    // Formato brasileiro, até 3 casas, com a unidade (menos na quantidade)
    expect(metric('Medições')).toBe('3');
    expect(metric('Mínimo')).toBe('31,5 °C');
    expect(metric('Máximo')).toBe('33 °C');
    expect(metric('Média')).toBe('32,167 °C');
    expect(metric('Desvio-padrão')).toBe('0,624 °C');
    expect(metric('RMS')).toBe('32,173 °C');

    expect(
      screen.getByRole('figure', { name: 'Gráfico de Temperatura' }),
    ).toBeTruthy();
  });

  it('should show the values without unit when the series has none', async () => {
    mockApi({ series: { ...series, unit: null }, metrics });
    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Temperatura' }),
    ).toBeTruthy();
    expect(metric('Média')).toBe('32,167');
  });

  it('should go back to the point of the series', async () => {
    mockApi();
    renderPage();
    await screen.findByRole('heading', { name: 'Temperatura (°C)' });

    fireEvent.click(screen.getByRole('link', { name: 'Voltar ao ponto' }));

    expect(screen.getByText('Página do ponto point-1')).toBeTruthy();
  });

  it('should show the error and try again when asked', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: { code: 'NOT_FOUND', message: 'Série temporal não encontrada' },
      },
    } as AxiosResponse;
    mockApi();
    vi.mocked(api.get).mockRejectedValueOnce(error);
    renderPage();

    expect(
      await screen.findByText('Série temporal não encontrada'),
    ).toBeTruthy();
    // Sem a série, ainda não se sabe o ponto: o botão volta à lista
    expect(
      screen.getByRole('link', { name: 'Pontos de monitoramento' }),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    expect(
      await screen.findByRole('heading', { name: 'Temperatura (°C)' }),
    ).toBeTruthy();
  });

  it('should not show the series visited before while the new one loads', async () => {
    // A store ainda tem a série 1, de uma visita anterior
    mockApi();
    const store = setupStore();
    await store.dispatch(fetchTimeSeriesDetails('series-1'));
    // E a API ainda não respondeu sobre a série 2
    vi.mocked(api.get).mockReturnValue(new Promise(() => undefined));

    renderPage(store, '/time-series/series-2');

    expect(screen.getByLabelText('Carregando a série')).toBeTruthy();
    expect(screen.queryByText(/Temperatura/)).toBeNull();
    expect(screen.queryByRole('figure')).toBeNull();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith('/time-series/series-2', {
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
