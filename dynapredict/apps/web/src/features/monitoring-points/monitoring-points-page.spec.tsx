import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import type { MonitoringPointListQuery } from '@dynapredict/shared';
import { setupStore } from '../../app/store';
import { api } from '../../lib/api-client';
import type { Machine } from '../machines/machines.slice';
import { MonitoringPointsPage } from './monitoring-points-page';
import type {
  MonitoringPoint,
  MonitoringPointsPage as PointsPage,
} from './monitoring-points.slice';

// O total de séries no topo da página tem os próprios testes. Aqui ele vira
// "nada", para as chamadas à API serem só as da lista de pontos
vi.mock('../time-series/time-series-count', () => ({
  TimeSeriesCount: () => null,
}));

const points: MonitoringPoint[] = [
  {
    id: 'point-1',
    name: 'Mancal LA',
    machine: { id: 'machine-1', name: 'Bomba 01', type: 'Pump' },
    sensor: { id: 'sensor-1', model: 'HF+', serialNumber: 'DyL4.01.A0001' },
  },
  {
    id: 'point-2',
    name: 'Motor',
    machine: { id: 'machine-2', name: 'Ventilador 01', type: 'Fan' },
    sensor: null,
  },
];

const machines: Machine[] = [
  {
    id: 'machine-1',
    name: 'Bomba 01',
    type: 'Pump',
    createdAt: '2026-11-21T12:00:00.000Z',
    updatedAt: '2026-11-21T12:00:00.000Z',
  },
];

function pageOf(items: MonitoringPoint[], total = items.length): PointsPage {
  return { items, total, page: 1, pageSize: 5 };
}

// Marcador da página de um ponto: mostra o id que veio na URL
function PointPageMarker() {
  const { id } = useParams();
  return <h1>Página do ponto {id}</h1>;
}

function renderPage() {
  render(
    <Provider store={setupStore()}>
      <MemoryRouter
        initialEntries={['/monitoring-points']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/monitoring-points" element={<MonitoringPointsPage />} />
          <Route path="/monitoring-points/:id" element={<PointPageMarker />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

// Os parâmetros que a página mandou na última chamada à API
function lastParams() {
  const calls = vi.mocked(api.get).mock.calls;
  return calls[calls.length - 1][1]?.params;
}

// Espera a resposta da API chegar (a barra de "carregando" some). Sem isso,
// a resposta chegaria depois do fim do teste, e o React reclamaria
async function waitForLoad() {
  await waitFor(() =>
    expect(
      screen.queryByLabelText('Carregando pontos de monitoramento'),
    ).toBeNull(),
  );
}

describe('MonitoringPointsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('should show a row for each point, with its machine and sensor', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf(points) });
    renderPage();

    expect(
      screen.getByLabelText('Carregando pontos de monitoramento'),
    ).toBeTruthy();

    const rows = await screen.findAllByRole('row');
    // 1 linha de cabeçalho + 2 pontos
    expect(rows).toHaveLength(3);
    expect(within(rows[1]).getByText('Bomba 01')).toBeTruthy();
    expect(within(rows[1]).getByText('Pump')).toBeTruthy();
    expect(within(rows[1]).getByText('Mancal LA')).toBeTruthy();
    expect(within(rows[1]).getByText('HF+')).toBeTruthy();
    expect(within(rows[1]).getByText('DyL4.01.A0001')).toBeTruthy();
    expect(within(rows[2]).getByText('Sem sensor')).toBeTruthy();
    // A primeira busca: página 1, 5 por página, pelo nome da máquina
    expect(lastParams()).toEqual({
      page: 1,
      pageSize: 5,
      sortBy: 'machineName',
      order: 'asc',
    });
  });

  it('should open the page of a point from its name', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf(points) });
    renderPage();

    // O segundo ponto, para garantir que o link leva ao ponto da linha
    fireEvent.click(await screen.findByRole('link', { name: 'Motor' }));

    expect(screen.getByText('Página do ponto point-2')).toBeTruthy();
  });

  it('should sort by a column and invert the order on the second click', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf(points) });
    renderPage();
    await screen.findByText('Mancal LA');

    fireEvent.click(screen.getByRole('button', { name: 'Tipo' }));
    expect(lastParams()).toMatchObject({ sortBy: 'machineType', order: 'asc' });
    await waitForLoad();

    fireEvent.click(screen.getByRole('button', { name: 'Tipo' }));
    expect(lastParams()).toMatchObject({
      sortBy: 'machineType',
      order: 'desc',
    });
    await waitForLoad();
  });

  it('should ask for the next page and go back to the first one when sorting', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf(points, 7) });
    renderPage();
    // 7 pontos, 5 por página: a primeira mostra do 1º ao 5º
    expect(await screen.findByText('1–5 de 7')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(lastParams()).toMatchObject({ page: 2 });
    await waitForLoad();

    fireEvent.click(screen.getByRole('button', { name: 'Ponto' }));
    expect(lastParams()).toMatchObject({ page: 1, sortBy: 'pointName' });
    await waitForLoad();
  });

  it('should not let a late answer replace a newer one', async () => {
    // A resposta do 1º clique fica "presa" até o teste soltá-la
    let answerLate: (response: { data: PointsPage }) => void = () => undefined;
    vi.spyOn(api, 'get')
      .mockResolvedValueOnce({ data: pageOf(points) })
      .mockReturnValueOnce(
        new Promise((resolve) => {
          answerLate = resolve;
        }),
      )
      .mockResolvedValueOnce({ data: pageOf([points[1]]) });
    renderPage();
    await screen.findByText('Mancal LA');

    // Dois cliques seguidos: o 2º responde na hora, o 1º ainda não
    fireEvent.click(screen.getByRole('button', { name: 'Tipo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tipo' }));
    await waitForLoad();
    expect(screen.queryByText('Mancal LA')).toBeNull();

    // A resposta da ordem antiga chega atrasada: tem que ser ignorada
    await act(async () => answerLate({ data: pageOf(points) }));
    expect(screen.queryByText('Mancal LA')).toBeNull();
    expect(screen.getByText('Motor')).toBeTruthy();
  });

  it('should explain when there are no points yet', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf([]) });
    renderPage();

    expect(
      await screen.findByText(
        'Nenhum ponto de monitoramento cadastrado ainda.',
      ),
    ).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('should show the error and try again when asked', async () => {
    vi.spyOn(api, 'get')
      .mockRejectedValueOnce(new Error('falhou'))
      .mockResolvedValueOnce({ data: pageOf(points) });
    renderPage();

    expect(await screen.findByText('Erro inesperado')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    expect(await screen.findByText('Mancal LA')).toBeTruthy();
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should create a point and reload the list', async () => {
    // A lista de pontos e, para o diálogo, a lista de máquinas
    vi.spyOn(api, 'get').mockImplementation(async (url) =>
      url === '/machines' ? { data: machines } : { data: pageOf(points) },
    );
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { id: 'point-3', name: 'Base', machineId: 'machine-1' },
    });
    renderPage();
    await screen.findByText('Mancal LA');

    fireEvent.click(screen.getByRole('button', { name: 'Novo ponto' }));
    // Espera as máquinas chegarem antes de abrir a lista delas
    await waitFor(() =>
      expect(screen.queryByText('Carregando máquinas...')).toBeNull(),
    );
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Máquina' }));
    fireEvent.click(screen.getByRole('option', { name: 'Bomba 01 (Pump)' }));
    fireEvent.change(screen.getByLabelText('Nome do ponto'), {
      target: { value: 'Base' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Ponto criado')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    // Buscou os pontos de novo: uma vez ao abrir a página e outra depois
    // de criar, porque a API é que sabe onde o ponto novo entra
    const pointCalls = vi
      .mocked(api.get)
      .mock.calls.filter(([url]) => url === '/monitoring-points');
    expect(pointCalls).toHaveLength(2);
    await waitForLoad();
  });
  it('should open the sensor dialog of a point and reload the list after saving', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf(points) });
    vi.spyOn(api, 'put').mockResolvedValue({
      data: { id: 'sensor-2', model: 'TcAg', serialNumber: 'DyL1.01.A0001' },
    });
    renderPage();

    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Sensor de Motor (Ventilador 01)',
      }),
    );
    expect(
      screen.getByRole('dialog', { name: 'Sensor do ponto Motor' }),
    ).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Modelo' }));
    fireEvent.click(screen.getByRole('option', { name: 'TcAg' }));
    fireEvent.change(screen.getByLabelText('Número de série'), {
      target: { value: 'DyL1.01.A0001' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));

    expect(await screen.findByText('Sensor salvo')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    // O sensor foi para o ponto certo, e a lista foi buscada de novo
    expect(api.put).toHaveBeenCalledWith('/monitoring-points/point-2/sensor', {
      model: 'TcAg',
      serialNumber: 'DyL1.01.A0001',
    });
    expect(api.get).toHaveBeenCalledTimes(2);
    await waitForLoad();
  });

  it('should delete a point after the confirmation and reload the list', async () => {
    vi.spyOn(api, 'get').mockResolvedValue({ data: pageOf(points) });
    vi.spyOn(api, 'delete').mockResolvedValue({ data: '' });
    renderPage();

    // O segundo ponto da tabela, para garantir que é o ponto da linha clicada
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir Motor (Ventilador 01)',
      }),
    );
    expect(screen.getByRole('dialog', { name: 'Excluir ponto?' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(await screen.findByText('Ponto excluído')).toBeTruthy();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(api.delete).toHaveBeenCalledWith('/monitoring-points/point-2');
    // Buscou a lista de novo e também o total de séries, porque as séries
    // do ponto foram junto
    const pointCalls = vi
      .mocked(api.get)
      .mock.calls.filter(([url]) => url === '/monitoring-points');
    expect(pointCalls).toHaveLength(2);
    expect(api.get).toHaveBeenCalledWith('/time-series/count', {
      signal: expect.any(AbortSignal),
    });
    await waitForLoad();
  });

  it('should go back to the previous page when the current one becomes empty', async () => {
    // 6 pontos: 5 na página 1 e o "Motor" sozinho na página 2.
    // Depois que o Motor é excluído, a página 2 fica vazia
    const firstPage = [1, 2, 3, 4, 5].map((n) => ({
      ...points[0],
      id: `point-1${n}`,
      name: `Ponto ${n}`,
    }));
    let deleted = false;
    vi.spyOn(api, 'get').mockImplementation(async (_url, config) => {
      // Os parâmetros que a página mandou: { page, pageSize, sortBy, order }
      const { page } = config?.params as MonitoringPointListQuery;
      const total = deleted ? 5 : 6;
      if (page === 2) {
        const items = deleted ? [] : [points[1]];
        return { data: { items, total, page: 2, pageSize: 5 } };
      }
      return { data: { items: firstPage, total, page: 1, pageSize: 5 } };
    });
    vi.spyOn(api, 'delete').mockImplementation(async () => {
      deleted = true;
      return { data: '' };
    });
    renderPage();
    expect(await screen.findByText('1–5 de 6')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
    fireEvent.click(
      await screen.findByRole('button', {
        name: 'Excluir Motor (Ventilador 01)',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    // Voltou sozinha para a página 1, que agora é a última
    expect(await screen.findByText('1–5 de 5')).toBeTruthy();
    expect(lastParams()).toMatchObject({ page: 1 });
    await waitForLoad();
  });
});
