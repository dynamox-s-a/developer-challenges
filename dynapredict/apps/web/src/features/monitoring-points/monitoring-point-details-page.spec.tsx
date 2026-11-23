import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import {
  fetchPointTimeSeries,
  type TimeSeriesSummary,
} from '../time-series/time-series.slice';
import { MonitoringPointDetailsPage } from './monitoring-point-details-page';
import type { MonitoringPoint } from './monitoring-points.slice';

const point: MonitoringPoint = {
  id: 'point-1',
  name: 'Mancal LA',
  machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
  sensor: { id: 'sensor-1', model: 'HF+', serialNumber: 'DyL4.01.A0001' },
};

const series: TimeSeriesSummary[] = [
  {
    id: 'series-1',
    name: 'Velocidade RMS',
    unit: 'mm/s',
    sensorSerialNumber: 'DyL4.01.A0001',
    monitoringPointId: 'point-1',
    sampleCount: 10000,
    startedAt: '2026-11-22T10:00:00.000Z',
    endedAt: '2026-11-22T12:46:39.000Z',
    createdAt: '2026-11-22T13:00:00.000Z',
  },
  {
    id: 'series-2',
    name: 'Temperatura',
    unit: null,
    sensorSerialNumber: 'DyL4.01.A0000',
    monitoringPointId: 'point-1',
    sampleCount: 3,
    startedAt: '2026-11-21T10:00:00.000Z',
    endedAt: '2026-11-21T10:20:00.000Z',
    createdAt: '2026-11-21T11:00:00.000Z',
  },
];

// A API falsa: a lista de séries numa URL, e o ponto na outra
function mockApi(answer = { point, series }) {
  vi.spyOn(api, 'get').mockImplementation(async (url) =>
    url.endsWith('/time-series')
      ? { data: answer.series }
      : { data: answer.point },
  );
}

// Um arquivo CSV escolhido pelo usuário (o File do jsdom não tem o .text()
// dos navegadores: veja o teste do diálogo de envio)
function csvFile(content: string) {
  const file = new File([content], 'temperatura.csv', { type: 'text/csv' });
  return Object.assign(file, { text: async () => content });
}

// Abre a página de um ponto. A rota da lista é só um marcador, para
// sabermos que o botão de voltar funcionou
function renderPage(store = setupStore(), path = '/monitoring-points/point-1') {
  render(
    <Provider store={store}>
      <MemoryRouter
        initialEntries={[path]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/monitoring-points" element={<h1>Lista de pontos</h1>} />
          <Route
            path="/monitoring-points/:id"
            element={<MonitoringPointDetailsPage />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('MonitoringPointDetailsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show the point and a row for each series', async () => {
    mockApi();
    renderPage();

    expect(screen.getByLabelText('Carregando o ponto')).toBeTruthy();
    expect(
      await screen.findByRole('heading', { name: 'Mancal LA' }),
    ).toBeTruthy();
    expect(screen.getByText('Máquina: Bomba 01 (Pump)')).toBeTruthy();
    expect(screen.getByText('Sensor: HF+ · DyL4.01.A0001')).toBeTruthy();

    const rows = screen.getAllByRole('row');
    // 1 linha de cabeçalho + 2 séries
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getByText('Velocidade RMS (mm/s)')).toBeTruthy();
    expect(within(rows[1]).getByText('10.000')).toBeTruthy();
    // As datas aparecem no fuso de quem usa, como o navegador formata
    const startedAt = new Date(series[0].startedAt).toLocaleString('pt-BR');
    expect(within(rows[1]).getByText(startedAt)).toBeTruthy();
    expect(within(rows[2]).getByText('Temperatura')).toBeTruthy();
    expect(within(rows[2]).getByText('DyL4.01.A0000')).toBeTruthy();
  });

  it('should say when the point has no sensor and no series yet', async () => {
    mockApi({ point: { ...point, sensor: null }, series: [] });
    renderPage();

    expect(
      await screen.findByText('Nenhuma série enviada para este ponto ainda.'),
    ).toBeTruthy();
    expect(screen.getByText('Sensor: sem sensor')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('should not let a point without a sensor receive data', async () => {
    mockApi({ point: { ...point, sensor: null }, series: [] });
    renderPage();

    const button = await screen.findByRole('button', { name: 'Enviar série' });
    expect(button.hasAttribute('disabled')).toBe(true);
    expect(
      screen.getByText('Coloque um sensor no ponto para enviar dados.'),
    ).toBeTruthy();
  });

  it('should upload a series and reload the list', async () => {
    mockApi();
    vi.spyOn(api, 'post').mockResolvedValue({ data: series[0] });
    renderPage();

    fireEvent.click(
      await screen.findByRole('button', { name: 'Enviar série' }),
    );
    expect(
      screen.getByRole('dialog', { name: 'Enviar série temporal' }),
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Nome da série'), {
      target: { value: 'Temperatura' },
    });
    fireEvent.change(screen.getByLabelText('Arquivo CSV'), {
      target: { files: [csvFile('2026-11-22T10:00:00Z,31.5')] },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));

    expect(await screen.findByText('Série enviada')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(api.post).toHaveBeenCalledWith(
      '/monitoring-points/point-1/time-series',
      expect.objectContaining({ name: 'Temperatura' }),
    );
    // Buscou as séries de novo: uma vez ao abrir a página e outra depois
    // de enviar, para a série nova aparecer na lista
    const seriesCalls = vi
      .mocked(api.get)
      .mock.calls.filter(([url]) => url.endsWith('/time-series'));
    expect(seriesCalls).toHaveLength(2);
    await waitFor(() =>
      expect(screen.queryByLabelText('Carregando o ponto')).toBeNull(),
    );
  });

  it('should show the error and try again when asked', async () => {
    const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST');
    error.response = {
      status: 404,
      data: {
        error: {
          code: 'NOT_FOUND',
          message: 'Ponto de monitoramento não encontrado',
        },
      },
    } as AxiosResponse;
    mockApi();
    vi.mocked(api.get).mockRejectedValueOnce(error);
    renderPage();

    expect(
      await screen.findByText('Ponto de monitoramento não encontrado'),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    expect(
      await screen.findByRole('heading', { name: 'Mancal LA' }),
    ).toBeTruthy();
  });

  it('should go back to the list of points', async () => {
    mockApi();
    renderPage();
    await screen.findByRole('heading', { name: 'Mancal LA' });

    fireEvent.click(
      screen.getByRole('link', { name: 'Pontos de monitoramento' }),
    );

    expect(screen.getByText('Lista de pontos')).toBeTruthy();
  });

  it('should not show the point visited before while the new one loads', async () => {
    // A store ainda tem o ponto 1, de uma visita anterior
    mockApi();
    const store = setupStore();
    await store.dispatch(fetchPointTimeSeries('point-1'));
    // E a API ainda não respondeu sobre o ponto 2
    vi.mocked(api.get).mockReturnValue(new Promise(() => undefined));

    renderPage(store, '/monitoring-points/point-2');

    expect(screen.getByLabelText('Carregando o ponto')).toBeTruthy();
    expect(screen.queryByText('Mancal LA')).toBeNull();
    expect(screen.queryByRole('table')).toBeNull();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith('/monitoring-points/point-2', {
        signal: expect.any(AbortSignal),
      }),
    );
  });
});
