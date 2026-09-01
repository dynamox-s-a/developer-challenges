import { describe, expect, it } from 'vitest';

import type { MonitoringPointDto, MonitoringPointPageDto } from '../../api/client';
import {
  assignSensor,
  createMonitoringPoint,
  fetchMonitoringPoints,
  initialMonitoringPointsState,
  monitoringPointsReducer,
  pageChanged,
  sortChanged,
} from './monitoringPointsSlice';

const point = (name: string): MonitoringPointDto => ({
  id: `id-${name}`,
  name,
  machine: { id: 'm1', name: 'P-101', type: 'Pump' },
  sensor: null,
  createdAt: '2026-08-28T12:00:00.000Z',
  updatedAt: '2026-08-28T12:00:00.000Z',
});

const pageDto = (
  items: MonitoringPointDto[],
  overrides: Partial<MonitoringPointPageDto> = {},
): MonitoringPointPageDto => ({
  items,
  total: items.length,
  page: 1,
  pageSize: 5,
  totalPages: 1,
  search: null,
  machineType: null,
  sensorModel: null,
  hasSensor: null,
  sortBy: 'machineName',
  sortDir: 'asc',
  ...overrides,
});

const createArg = { machineId: 'm1', name: 'X' };
const assignArg = { pointId: 'p1', serialNumber: 'S1', model: 'HF+' as const };

describe('monitoringPointsSlice — listagem', () => {
  it('1. marca loading e depois sucesso com a página', () => {
    let state = monitoringPointsReducer(
      initialMonitoringPointsState,
      fetchMonitoringPoints.pending('r1'),
    );
    expect(state.listStatus).toBe('loading');
    expect(state.listError).toBeNull();

    state = monitoringPointsReducer(
      state,
      fetchMonitoringPoints.fulfilled(pageDto([point('A'), point('B')]), 'r1'),
    );
    expect(state.listStatus).toBe('succeeded');
    expect(state.pageData?.items).toHaveLength(2);
  });

  it('2. falha guarda a mensagem e preserva a página anterior', () => {
    const loaded = monitoringPointsReducer(
      initialMonitoringPointsState,
      fetchMonitoringPoints.fulfilled(pageDto([point('A')]), 'r1'),
    );

    const state = monitoringPointsReducer(
      loaded,
      fetchMonitoringPoints.rejected(new Error('API fora do ar'), 'r2'),
    );
    expect(state.listStatus).toBe('failed');
    expect(state.listError).toBe('API fora do ar');
    expect(state.pageData?.items).toHaveLength(1);
  });

  it('3. página além da última recua para a última existente', () => {
    // Estado na página 3, mas o total só comporta 2 páginas (7 itens / 5 por página).
    const onPage3 = monitoringPointsReducer(initialMonitoringPointsState, pageChanged(3));
    const state = monitoringPointsReducer(
      onPage3,
      fetchMonitoringPoints.fulfilled(pageDto([], { total: 7, page: 3 }), 'r1'),
    );
    expect(state.page).toBe(2);
  });
});

describe('monitoringPointsSlice — ordenação e paginação', () => {
  it('4. pageChanged troca a página corrente', () => {
    const state = monitoringPointsReducer(initialMonitoringPointsState, pageChanged(2));
    expect(state.page).toBe(2);
  });

  it('5. clicar em outra coluna ordena por ela em asc e volta à página 1', () => {
    const onPage2 = monitoringPointsReducer(initialMonitoringPointsState, pageChanged(2));
    const state = monitoringPointsReducer(onPage2, sortChanged('sensorModel'));
    expect(state.sortBy).toBe('sensorModel');
    expect(state.sortDir).toBe('asc');
    expect(state.page).toBe(1);
  });

  it('6. clicar na coluna já ativa inverte a direção', () => {
    let state = monitoringPointsReducer(
      initialMonitoringPointsState,
      sortChanged('machineName'),
    );
    // machineName já é o padrão: o primeiro clique inverte para desc.
    expect(state.sortDir).toBe('desc');

    state = monitoringPointsReducer(state, sortChanged('machineName'));
    expect(state.sortDir).toBe('asc');
  });
});

describe('monitoringPointsSlice — criação e associação', () => {
  it('7. falha na criação preserva a página carregada', () => {
    const loaded = monitoringPointsReducer(
      initialMonitoringPointsState,
      fetchMonitoringPoints.fulfilled(pageDto([point('A')]), 'r1'),
    );

    const state = monitoringPointsReducer(
      loaded,
      createMonitoringPoint.rejected(new Error('Nome duplicado.'), 'r2', createArg),
    );
    expect(state.createStatus).toBe('failed');
    expect(state.createError).toBe('Nome duplicado.');
    expect(state.pageData?.items).toHaveLength(1);
    expect(state.listStatus).toBe('succeeded');
  });

  it('8. falha na associação guarda a mensagem da API', () => {
    const state = monitoringPointsReducer(
      initialMonitoringPointsState,
      assignSensor.rejected(
        new Error('O modelo "TcAg" não pode ser associado à máquina "P-101" (Pump).'),
        'r1',
        assignArg,
      ),
    );
    expect(state.assignStatus).toBe('failed');
    expect(state.assignError).toMatch(/TcAg/);
  });

  it('9. estados de criação e associação são independentes da listagem', () => {
    let state = monitoringPointsReducer(
      initialMonitoringPointsState,
      createMonitoringPoint.pending('r1', createArg),
    );
    expect(state.createStatus).toBe('loading');
    expect(state.listStatus).toBe('idle');

    state = monitoringPointsReducer(state, assignSensor.pending('r2', assignArg));
    expect(state.assignStatus).toBe('loading');
    expect(state.createStatus).toBe('loading');
  });
});
