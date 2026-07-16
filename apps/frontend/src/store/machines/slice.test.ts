import { describe, expect, it } from 'vitest';

import { machineFixture } from 'src/test/fixtures';

import {
  fetchMachines,
  fetchMachinesFailed,
  fetchMachinesSucceeded,
  machineSelected,
  machinesSlice,
} from './slice';

const reducer = machinesSlice.reducer;
const initial = machinesSlice.getInitialState();

describe('machinesSlice', () => {
  it('entra em loading e limpa o erro anterior ao buscar', () => {
    const state = reducer({ ...initial, error: 'falha antiga' }, fetchMachines());

    expect(state).toMatchObject({ status: 'loading', error: null });
  });

  it('seleciona a primeira máquina quando ainda não há seleção', () => {
    const state = reducer(initial, fetchMachinesSucceeded([machineFixture]));

    expect(state.selectedId).toBe('MCH-001');
    expect(state.status).toBe('succeeded');
  });

  it('preserva a seleção do usuário ao recarregar a lista', () => {
    const outra = { ...machineFixture, id: 'MCH-002' };
    const selected = reducer(initial, machineSelected('MCH-002'));
    const state = reducer(selected, fetchMachinesSucceeded([machineFixture, outra]));

    expect(state.selectedId).toBe('MCH-002');
  });

  it('descarta seleção que não existe na lista, cobrindo link com máquina inválida', () => {
    const selected = reducer(initial, machineSelected('NAO-EXISTE'));
    const state = reducer(selected, fetchMachinesSucceeded([machineFixture]));

    expect(state.selectedId).toBe('MCH-001');
  });

  it('não quebra a seleção com lista vazia', () => {
    const state = reducer(initial, fetchMachinesSucceeded([]));

    expect(state.selectedId).toBeNull();
  });

  it('guarda a mensagem de erro', () => {
    const state = reducer(initial, fetchMachinesFailed('API fora do ar'));

    expect(state).toMatchObject({ status: 'failed', error: 'API fora do ar' });
  });
});
