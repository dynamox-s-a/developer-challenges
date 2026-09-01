import { describe, expect, it } from 'vitest';

import type { MachineDto } from '../../api/client';
import {
  createMachine,
  deleteMachine,
  fetchMachines,
  initialMachinesState,
  machinesReducer,
  updateMachine,
} from './machinesSlice';

const machine = (name: string, type: 'Pump' | 'Fan' = 'Pump'): MachineDto => ({
  id: `id-${name}`,
  name,
  type,
  createdAt: '2026-08-27T12:00:00.000Z',
  updatedAt: '2026-08-27T12:00:00.000Z',
});

const arg = { name: 'X', type: 'Pump' as const };

describe('machinesSlice — listagem', () => {
  it('1. marca loading e depois sucesso com a lista', () => {
    let state = machinesReducer(initialMachinesState, fetchMachines.pending('r1'));
    expect(state.listStatus).toBe('loading');
    expect(state.listError).toBeNull();

    state = machinesReducer(
      state,
      fetchMachines.fulfilled([machine('P-101'), machine('V-200', 'Fan')], 'r1', undefined),
    );
    expect(state.listStatus).toBe('succeeded');
    expect(state.items).toHaveLength(2);
  });

  it('2. representa lista vazia sem erro', () => {
    const state = machinesReducer(
      initialMachinesState,
      fetchMachines.fulfilled([], 'r1', undefined),
    );
    expect(state.listStatus).toBe('succeeded');
    expect(state.items).toHaveLength(0);
    expect(state.listError).toBeNull();
  });

  it('3. guarda a mensagem quando a listagem falha', () => {
    const state = machinesReducer(
      initialMachinesState,
      fetchMachines.rejected(new Error('API fora do ar'), 'r1', undefined),
    );
    expect(state.listStatus).toBe('failed');
    expect(state.listError).toBe('API fora do ar');
  });

  it('ordena a lista recebida por nome', () => {
    const state = machinesReducer(
      initialMachinesState,
      fetchMachines.fulfilled([machine('Z-9'), machine('A-1')], 'r1', undefined),
    );
    expect(state.items.map((m) => m.name)).toEqual(['A-1', 'Z-9']);
  });
});

describe('machinesSlice — cadastro', () => {
  it('4. marca loading e depois sucesso no cadastro', () => {
    let state = machinesReducer(initialMachinesState, createMachine.pending('r2', arg));
    expect(state.createStatus).toBe('loading');
    expect(state.createError).toBeNull();

    state = machinesReducer(state, createMachine.fulfilled(machine('P-102'), 'r2', arg));
    expect(state.createStatus).toBe('succeeded');
  });

  it('5. adiciona a máquina criada mantendo a ordenação por nome', () => {
    const loaded = machinesReducer(
      initialMachinesState,
      fetchMachines.fulfilled([machine('A-1'), machine('Z-9')], 'r1', undefined),
    );

    const state = machinesReducer(loaded, createMachine.fulfilled(machine('M-5'), 'r2', arg));

    expect(state.items.map((m) => m.name)).toEqual(['A-1', 'M-5', 'Z-9']);
  });

  it('6. falha no cadastro preserva a lista já carregada', () => {
    const loaded = machinesReducer(
      initialMachinesState,
      fetchMachines.fulfilled([machine('P-101')], 'r1', undefined),
    );

    const state = machinesReducer(
      loaded,
      createMachine.rejected(new Error('Já existe uma máquina com o nome "P-101".'), 'r2', arg),
    );

    expect(state.createStatus).toBe('failed');
    expect(state.createError).toBe('Já existe uma máquina com o nome "P-101".');
    // A lista continua intacta: erro de cadastro não pode esvaziar a tela.
    expect(state.items).toHaveLength(1);
    expect(state.listStatus).toBe('succeeded');
  });

  it('7. status de listagem e de cadastro são independentes', () => {
    const listing = machinesReducer(initialMachinesState, fetchMachines.pending('r1'));
    expect(listing.listStatus).toBe('loading');
    expect(listing.createStatus).toBe('idle');

    const creating = machinesReducer(listing, createMachine.pending('r2', arg));
    expect(creating.createStatus).toBe('loading');
    expect(creating.listStatus).toBe('loading');

    const created = machinesReducer(creating, createMachine.fulfilled(machine('N-1'), 'r2', arg));
    // Concluir o cadastro não conclui a listagem.
    expect(created.createStatus).toBe('succeeded');
    expect(created.listStatus).toBe('loading');
  });

  it('não cria item otimista antes da resposta da API', () => {
    const state = machinesReducer(initialMachinesState, createMachine.pending('r2', arg));
    expect(state.items).toHaveLength(0);
  });
});

describe('machinesSlice — edição e exclusão (MAC-03)', () => {
  const loaded = () =>
    machinesReducer(
      initialMachinesState,
      fetchMachines.fulfilled([machine('A-1'), machine('Z-9', 'Fan')], 'r1', undefined),
    );

  it('8. edição substitui o item pelo registro da API e reordena', () => {
    const renamed = { ...machine('A-1'), name: 'X-5' };
    const state = machinesReducer(
      loaded(),
      updateMachine.fulfilled(renamed, 'r2', { id: renamed.id, changes: { name: 'X-5' } }),
    );

    expect(state.updateStatus).toBe('succeeded');
    // "A-1" virou "X-5" e a lista foi reordenada por nome.
    expect(state.items.map((m) => m.name)).toEqual(['X-5', 'Z-9']);
  });

  it('9. falha na edição preserva a lista e guarda a mensagem', () => {
    const state = machinesReducer(
      loaded(),
      updateMachine.rejected(
        new Error('A máquina não pode virar Pump: sensor(es) TcAg/TcAs associado(s).'),
        'r2',
        { id: 'id-Z-9', changes: { type: 'Pump' } },
      ),
    );

    expect(state.updateStatus).toBe('failed');
    expect(state.updateError).toMatch(/TcAg/);
    expect(state.items).toHaveLength(2);
  });

  it('10. exclusão remove somente a máquina confirmada', () => {
    const state = machinesReducer(loaded(), deleteMachine.fulfilled('id-A-1', 'r2', 'id-A-1'));

    expect(state.deleteStatus).toBe('succeeded');
    expect(state.items.map((m) => m.name)).toEqual(['Z-9']);
  });

  it('11. falha na exclusão preserva a lista', () => {
    const state = machinesReducer(
      loaded(),
      deleteMachine.rejected(new Error('Máquina "id-A-1" não encontrada.'), 'r2', 'id-A-1'),
    );

    expect(state.deleteStatus).toBe('failed');
    expect(state.deleteError).toMatch(/não encontrada/);
    expect(state.items).toHaveLength(2);
  });

  it('12. estados de edição e exclusão são independentes do cadastro', () => {
    let state = machinesReducer(
      initialMachinesState,
      updateMachine.pending('r1', { id: 'x', changes: {} }),
    );
    expect(state.updateStatus).toBe('loading');
    expect(state.createStatus).toBe('idle');
    expect(state.deleteStatus).toBe('idle');

    state = machinesReducer(state, deleteMachine.pending('r2', 'x'));
    expect(state.deleteStatus).toBe('loading');
    expect(state.updateStatus).toBe('loading');
  });
});
