import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThemeProvider } from 'src/theme';

import { machineFixture, seriesFixture } from 'src/test/fixtures';

const listMachines = vi.fn();
const listMeasurements = vi.fn();

vi.mock('src/lib/orpc-client', async () => {
  const actual = await vi.importActual<typeof import('src/lib/orpc-client')>('src/lib/orpc-client');

  return {
    ...actual,
    orpcClient: {
      machines: { list: (...args: unknown[]) => listMachines(...args) },
      measurements: { list: (...args: unknown[]) => listMeasurements(...args) },
    },
  };
});

vi.mock('./metric-chart', () => ({
  MetricChart: ({ group }: { group: { label: string; series: unknown[] } }) => (
    <div data-testid="metric-chart">{`${group.label}: ${group.series.length}`}</div>
  ),
}));

const { DataView } = await import('./data-view');
const { createStore } = await import('src/store');

function LocationProbe() {
  return <span data-testid="url-search">{useLocation().search}</span>;
}

const urlSearch = () => screen.getByTestId('url-search').textContent;

const urlFilters = () => {
  const params = new URLSearchParams(urlSearch() ?? '');

  return { machine: params.get('machine'), period: params.get('period') };
};

const renderView = (initialUrl = '/data') =>
  render(
    <MemoryRouter initialEntries={[initialUrl]}>
      <Provider store={createStore()}>
        <ThemeProvider>
          <DataView />
          <LocationProbe />
        </ThemeProvider>
      </Provider>
    </MemoryRouter>
  );

describe('DataView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listMachines.mockResolvedValue({ data: [machineFixture, { ...machineFixture, id: 'MCH-002', name: 'Bomba Centrífuga 04' }] });
    listMeasurements.mockResolvedValue({ machineId: 'MCH-001', series: seriesFixture });
  });

  it('busca os dados ao acessar a rota e exibe um gráfico por grandeza', async () => {
    renderView();

    await waitFor(() => expect(screen.getAllByTestId('metric-chart')).toHaveLength(3));

    expect(listMachines).toHaveBeenCalledTimes(1);
    expect(listMeasurements).toHaveBeenCalledWith(expect.objectContaining({ machineId: 'MCH-001' }));
  });

  it('exibe o cabeçalho com as informações da máquina', async () => {
    renderView();

    expect(await screen.findByRole('heading', { name: 'Ventilador de Exaustão 01' })).toBeInTheDocument();
    expect(screen.getByText('1780 RPM')).toBeInTheDocument();
    expect(screen.getByText('DynaLogger TcAg · HF-8842-2023')).toBeInTheDocument();
    expect(screen.getByText('Em alerta')).toBeInTheDocument();
  });

  it('rebusca com o recorte de tempo ao trocar o período', async () => {
    const user = userEvent.setup();
    renderView();

    await waitFor(() => expect(listMeasurements).toHaveBeenCalledTimes(1));

    await user.click(screen.getByRole('button', { name: '7 dias' }));

    await waitFor(() => expect(listMeasurements).toHaveBeenCalledTimes(2));

    expect(listMeasurements).toHaveBeenLastCalledWith({
      machineId: 'MCH-001',
      from: '2023-12-05T15:02:42.000Z',
      to: '2023-12-12T15:02:42.000Z',
    });
  });

  it('rebusca ao trocar de máquina', async () => {
    const user = userEvent.setup();
    renderView();

    await waitFor(() => expect(listMeasurements).toHaveBeenCalledTimes(1));

    await user.click(screen.getByLabelText('Selecionar máquina'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Bomba Centrífuga 04'));

    await waitFor(() =>
      expect(listMeasurements).toHaveBeenLastCalledWith(expect.objectContaining({ machineId: 'MCH-002' }))
    );
  });

  it('mostra o erro da API com ação de tentar de novo', async () => {
    listMeasurements.mockRejectedValue(new Error('API fora do ar'));
    const user = userEvent.setup();
    renderView();

    expect(await screen.findByText('API fora do ar')).toBeInTheDocument();
    expect(screen.queryAllByTestId('metric-chart')).toHaveLength(0);

    listMeasurements.mockResolvedValue({ machineId: 'MCH-001', series: seriesFixture });
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    await waitFor(() => expect(screen.getAllByTestId('metric-chart')).toHaveLength(3));
  });

  it('avisa quando o período selecionado não tem leitura', async () => {
    listMeasurements.mockResolvedValue({ machineId: 'MCH-001', series: [] });
    renderView();

    expect(await screen.findByText('Nenhuma leitura no período')).toBeInTheDocument();
  });
});

describe('DataView — filtros na URL', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    listMachines.mockResolvedValue({
      data: [machineFixture, { ...machineFixture, id: 'MCH-002', name: 'Bomba Centrífuga 04' }],
    });
    listMeasurements.mockResolvedValue({ machineId: 'MCH-001', series: seriesFixture });
  });

  it('aplica máquina e período vindos da URL ao abrir o link', async () => {
    renderView('/data?machine=MCH-002&period=7d');

    await waitFor(() =>
      expect(listMeasurements).toHaveBeenLastCalledWith({
        machineId: 'MCH-002',
        from: '2023-12-05T15:02:42.000Z',
        to: '2023-12-12T15:02:42.000Z',
      })
    );

    expect(screen.getByRole('button', { name: '7 dias' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('reflete na URL os filtros escolhidos, para o link ser compartilhável', async () => {
    const user = userEvent.setup();
    renderView();

    await waitFor(() => expect(urlFilters()).toEqual({ machine: 'MCH-001', period: 'all' }));

    await user.click(screen.getByRole('button', { name: '30 dias' }));

    await waitFor(() => expect(urlFilters()).toEqual({ machine: 'MCH-001', period: '30d' }));
  });

  it('reflete na URL a troca de máquina', async () => {
    const user = userEvent.setup();
    renderView();

    await waitFor(() => expect(urlSearch()).toContain('machine=MCH-001'));

    await user.click(screen.getByLabelText('Selecionar máquina'));
    await user.click(within(await screen.findByRole('listbox')).getByText('Bomba Centrífuga 04'));

    await waitFor(() => expect(urlSearch()).toContain('machine=MCH-002'));
  });

  it('cai para a primeira máquina quando a URL aponta para uma inexistente', async () => {
    renderView('/data?machine=NAO-EXISTE');

    await waitFor(() =>
      expect(listMeasurements).toHaveBeenLastCalledWith(expect.objectContaining({ machineId: 'MCH-001' }))
    );

    await waitFor(() => expect(urlSearch()).toContain('machine=MCH-001'));
  });

  it('ignora período inválido na URL e mantém o padrão', async () => {
    renderView('/data?period=lixo');

    await waitFor(() => expect(urlFilters()).toEqual({ machine: 'MCH-001', period: 'all' }));
    expect(screen.getByRole('button', { name: 'Tudo' })).toHaveAttribute('aria-pressed', 'true');
  });
});
