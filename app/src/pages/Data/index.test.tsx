import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Data from './index';

const mockUseChartSync = vi.fn();

vi.mock('../../hooks/useChartSync', () => ({
  default: (...args: unknown[]) => mockUseChartSync(...args),
}));

vi.mock('../../components/Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('../../components/Loading', () => ({
  default: () => <div data-testid="loading">Loading</div>,
}));

vi.mock('../../components/MachineInfo', () => ({
  default: () => <div data-testid="machine-info">MachineInfo</div>,
}));

vi.mock('../../components/Chart', () => ({
  default: ({ title, series }: { title: string; series: unknown[] }) => (
    <div data-testid="chart">
      <span>{title}</span>
      <span data-testid="series-length">{series.length}</span>
    </div>
  ),
}));

vi.mock('../../parsers/parserSeries', () => ({
  parseSeries: vi.fn((data: unknown[] = [], indexes: number[] = []) =>
    indexes.map((index) => ({
      type: 'line',
      name: `serie-${index}`,
      data: data[index] ? [[1, 1]] : [],
    })),
  ),
}));

const reloadSpy = vi.fn();
const locationMock = {
  ...window.location,
  reload: reloadSpy,
};

Object.defineProperty(window, 'location', {
  configurable: true,
  value: locationMock,
});

type DataState = {
  data: unknown[];
  loading: boolean;
  error: string | null;
};

function createStore(dataState: DataState) {
  return configureStore({
    reducer: {
      data: () => dataState,
    },
  });
}

function renderDataPage(dataState: DataState) {
  const store = createStore(dataState);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Data />
      </MemoryRouter>
    </Provider>,
  );
}

describe('Data page', () => {
  beforeEach(() => {
    cleanup();
    mockUseChartSync.mockClear();
    reloadSpy.mockClear();
  });

  it('renders loading state when loading is true', () => {
    renderDataPage({ data: [], loading: true, error: null });

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
  });

  it('renders error state and reload button when error exists', () => {
    renderDataPage({ data: [], loading: false, error: 'Falha ao carregar dados' });

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByText('Ocorreu um erro ao carregar os dados')).toBeInTheDocument();
    expect(screen.getByText('Falha ao carregar dados')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Recarregar tela' }));
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('renders success state with charts and machine info', () => {
    const data = [
      { name: 'Aceleração X', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 1.1 }] },
      { name: 'Aceleração Y', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 1.2 }] },
      { name: 'Aceleração Z', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 1.3 }] },
      { name: 'Velocidade X', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 0.7 }] },
      { name: 'Velocidade Y', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 0.8 }] },
      { name: 'Velocidade Z', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 0.9 }] },
      { name: 'Temperatura', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 25 }] },
    ];

    renderDataPage({ data, loading: false, error: null });

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('machine-info')).toBeInTheDocument();
    expect(screen.getAllByTestId('chart')).toHaveLength(3);
    expect(screen.getByText('Aceleração RMS')).toBeInTheDocument();
    expect(screen.getByText('Temperatura')).toBeInTheDocument();
    expect(screen.getByText('Velocidade RMS')).toBeInTheDocument();
  });

  it('dispatches fetch action on mount and calls useChartSync with current data', () => {
    const data = [
      { name: 'Temperatura', data: [{ datetime: '2026-01-01T00:00:00.000Z', max: 25 }] },
    ];
    const store = createStore({ data, loading: false, error: null });
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Data />
        </MemoryRouter>
      </Provider>,
    );

    expect(dispatchSpy).toHaveBeenCalledWith({ type: 'data/FETCH_REQUEST' });
    expect(mockUseChartSync).toHaveBeenCalledTimes(1);

    const firstCallArg = mockUseChartSync.mock.calls[0][0] as {
      containerRef: { current: HTMLDivElement | null };
      data: unknown[];
    };

    expect(firstCallArg.data).toEqual(data);
    expect(firstCallArg.containerRef).toBeTruthy();
  });

  it('renders correctly with empty data and no error', () => {
    const { container } = renderDataPage({ data: [], loading: false, error: null });

    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
