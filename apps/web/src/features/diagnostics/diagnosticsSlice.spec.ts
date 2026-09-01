import { describe, expect, it } from 'vitest';

import {
  diagnosticsReducer,
  fetchHealth,
  initialState,
} from './diagnosticsSlice';

describe('diagnosticsSlice — estado do sistema', () => {
  it('marca o carregamento do health check sem apagar o último dado válido', () => {
    const previous = {
      ...initialState,
      healthStatus: 'succeeded' as const,
      health: {
        status: 'ok' as const,
        database: 'up' as const,
        version: '0.1.0',
        timestamp: '2026-08-29T12:00:00.000Z',
      },
    };
    const state = diagnosticsReducer(previous, fetchHealth.pending('health-1'));
    expect(state.healthStatus).toBe('loading');
    expect(state.health).toEqual(previous.health);
    expect(state.healthError).toBeNull();
  });

  it('armazena API, banco, versão e timestamp devolvidos pelo backend', () => {
    const health = {
      status: 'ok' as const,
      database: 'up' as const,
      version: '0.1.0',
      timestamp: '2026-08-29T12:00:00.000Z',
    };
    const state = diagnosticsReducer(
      initialState,
      fetchHealth.fulfilled(health, 'health-2'),
    );
    expect(state).toMatchObject({ healthStatus: 'succeeded', health, healthError: null });
  });

  it('distingue API indisponível e preserva a mensagem técnica', () => {
    const state = diagnosticsReducer(
      initialState,
      fetchHealth.rejected(new Error('API fora do ar'), 'health-3'),
    );
    expect(state.healthStatus).toBe('failed');
    expect(state.health).toBeNull();
    expect(state.healthError).toBe('API fora do ar');
  });
});
